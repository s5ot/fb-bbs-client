angular.module('ngBoilerplate.detail', [
  'ui.router',
  'plusOne',
  'ngFacebook',
  'infinite-scroll'
])
.controller('DetailCtrl', function DetailController($scope, $http, $modal, $log, $facebook, $stateParams, Reddit, $state) {
  $scope.reddit = new Reddit($stateParams.topicId);
  $scope.topicId = $stateParams.topicId;

  $scope.fetchPosts = function() {
    console.log('fetchPosts');

    $http.get('http://localhost:3000/topics/' + $stateParams.topicId + '.json')
    .success(function(data) {
      $scope.topic = data;
    })
    .error(function(data) {
      console.error(data);
    });
  };

  $scope.openAlbum = function(size) {
    $facebook.api('/me/albums').then(
     function(data) {
      $scope.albums = data.data;

      var modalInstance = $modal.open({
        templateUrl: 'home/album.tpl.html',
        controller: 'AlbumModalCtrl',
        size: size,
        resolve: {
          albums: function () {
            return $scope.albums;
          }
        }
      });
      modalInstance.result.then(function (photo) {
        console.log(photo);
        $scope.choosedPhoto = photo;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    },
    function(err) {
      console.log(err);
    });
  };

  $scope.confirmPost = function(topicId, postContent) {
    $scope.topicId = topicId;
    $scope.postContent = postContent;
    var modalInstance = $modal.open({
      templateUrl: 'home/confirm_post.tpl.html',
      controller: 'ConfirmPostModalCtrl',
      size: 'lg',
      resolve: {
        postContent: function () {
          return $scope.postContent;
        },
        photo: function () {
          return $scope.choosedPhoto;
        }
      }
    });

    modalInstance.result.then(function (photo) {
      console.log('ok');
      var imgUrl = photo ? photo.picture : '';
      var imgId = photo ? photo.id : '';

      $http.post('http://localhost:3000/posts.json', {
        post: {
        topic_id: $scope.topicId,
        content: $scope.postContent,
        user_id: $scope.userId,
        img_url: imgUrl,
        img_id: imgId
        }
      }).
      success(function(data, status, headers, config) {
        $scope.fetchTopics();
        if ($scope.fetchPosts) {
          $scope.fetchPosts();
        }
        $scope.postContent = null;
        $scope.choosedPhoto = null;
        $state.go('home');
      }).
      error(function(data, status, headers, config) {
        console.error(data);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
})
.factory('Reddit', function($http) {
  var Reddit = function(topicId) {
    this.topicId = topicId;
    this.page = 1;
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function(topicId) {
    if (this.busy) {
      return;
    }
    this.busy = true;

    $http.get('http://localhost:3000/posts.json?' + 'topic_id=' + this.topicId + '&page=' + this.page)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        this.items.push(data[i]);
      }
      this.busy = false;
      this.page += 1;
    }.bind(this))
    .error(function(data) {
      console.error(data);
    });
  };

  return Reddit;
});
