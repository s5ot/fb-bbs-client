angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router',
  'ngFacebook'
])

.config( function myAppConfig ($stateProvider, $urlRouterProvider, $facebookProvider, $httpProvider) {
  $urlRouterProvider.otherwise( '/home' );

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

.controller('AppCtrl', function AppCtrl ( $scope, $location, $facebook, $http, $modal) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
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
console.log(response);
        $scope.userId = response.id;
        $scope.welcomeMsg = "Welcome, " + response.first_name;
        $scope.profile_img_url = "https://graph.facebook.com/" + response.id + "/picture";
        $scope.isLoggedIn = true;
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
    $http.get('http://localhost:3000/topics.json').success(function(data) {
      $scope.topics = data;
    })
    .error(function(data) {
      console.error(data);
    });
  };
});
