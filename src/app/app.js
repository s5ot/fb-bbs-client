angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.detail',
  'ngBoilerplate.about',
  'ui.router',
  'ngFacebook'
])

//.constant('apiServerRoot',  'http://localhost:3000')
.constant('apiServerRoot', 'https://fb-bbs-server.herokuapp.com')

.config( function myAppConfig ($stateProvider, $urlRouterProvider, $facebookProvider, $httpProvider) {
  $urlRouterProvider.otherwise( '/home' );

  $stateProvider.state('home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });

  $stateProvider.state('detail', {
    url: '/topics/{topicId:[0-9]{1,4}}',
    views: {
      "main": {
        controller: 'DetailCtrl',
        templateUrl: 'detail/detail.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });

  $facebookProvider.setAppId('778121218942102');
  $facebookProvider.setCustomInit({
    xfbml: true,
    version: 'v2.2'
  });

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
})

.run( function run () {
  // facebookのjs読み込み
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
})

.controller('AppCtrl', function AppCtrl ( $scope, $location, $facebook, $http, $modal, apiServerRoot) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined(toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });

  $scope.isLoggedIn = false;

  $scope.login = function() {
    $facebook.login().then( refresh );
  };

  $scope.logout = function() {
    $facebook.logout().then( refresh );
  };

  function refresh() {
    $facebook.api("/me").then(
      function(response) {
        $scope.userId = response.id;
        $scope.welcomeMsg = "Welcome, " + response.name;
        $scope.profile_img_url = "https://graph.facebook.com/" + response.id + "/picture";
        $scope.isLoggedIn = true;

        $http.post(apiServerRoot + '/users.json', {
          user: {
            fb_id: response.id,
            name: response.name,
            sex: response.gender,
            profile_img_url: $scope.profile_img_url
          }
        }).
        success(function(data, status, headers, config) {
          console.error(data);
          $scope.fbId = data.fb_id;
          $scope.userId = data.id;
        }).
        error(function(data, status, headers, config) {
          console.error(data);
        });
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
        $scope.isLoggedIn = false;
      }
    );
    $facebook.getLoginStatus().then(
      function(response){
        console.log(response);
      },
      function(er){
      }
    );
  }

  $scope.fetchTopics = function() {
    $http.get(apiServerRoot + '/topics.json').success(function(data) {
      $scope.topics = data;
      $scope.isTopicPresent = (data.length > 0);
    })
    .error(function(data) {
      console.error(data);
    });
  };
});
