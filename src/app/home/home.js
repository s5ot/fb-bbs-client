angular.module('ngBoilerplate.home', [
  'ui.router',
  'plusOne',
  'ngFacebook'
])

.config(function config( $stateProvider ) {
})

.controller('HomeCtrl', function HomeController($scope, $http, $modal, $log, $facebook) {
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
        $scope.choosedPhoto = photo;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    },
    function(err) {
      console.log(err);
    });
  };

  $scope.createTopic = function(topicTitle, postContent) {
    var imgUrl = $scope.choosedPhoto ? $scope.choosedPhoto.picture : '';
    var imgId = $scope.choosedPhoto ? $scope.choosedPhoto.id : '';
    $http.post('http://localhost:3000/topics.json', {
      topic: {
        title: topicTitle,
        user_id: $scope.userId,
        img_url: imgUrl,
        posts_attributes: [{
          content: postContent,
          user_id: $scope.userId,
          img_id: imgId
        }]
      }
    }).
    success(function(data, status, headers, config) {
      $scope.topicTitle = null;
      $scope.newTopicPostContent = null;
      $scope.choosedPhoto = null;
      $scope.fetchTopics();
    }).
    error(function(data, status, headers, config) {
      console.error(data);
    });
  };
})

.controller('AlbumModalCtrl', function AlbumModalController($scope, $http, $modalInstance, $log, $facebook, albums) {
  $scope.albums = albums;

  $scope.chooseAlbum = function (album) {
    console.log(album);
    $scope.isChoosedAlbum = true;
    $facebook.api(album.id + '/photos').then(
     function(res) {
      console.log(res.data);
      $scope.photos = res.data;
    },
    function(err) {
      $scope.isChoosedAlbum = false;
      console.error(err);
    });
  };

  $scope.choosePhoto = function (photo) {
    $modalInstance.close(photo);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('ConfirmPostModalCtrl', function ConfirmPostModalController($scope, $http, $modalInstance, $log, $facebook, postContent, photo) {
  $scope.postContent = postContent;
  $scope.photo = photo;

  $scope.ok = function () {
    var ret = $scope.photo ? $scope.photo.picture : '';
    $modalInstance.close(photo);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('TopicCtrl', function HomeController($scope, $http, $modal, $log, $facebook, Reddit, $stateParams, $state) {

  if ($stateParams.topicId) {
    $scope.reddit = new Reddit($stateParams.topicId);
    $scope.topicId = $stateParams.topicId;
  }

  $scope.fetchPosts = function() {
    console.log('fetchPosts');

    $http.get('http://localhost:3000/topics/' + $scope.topicId + '.json')
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

  $scope.createTopic = function(topicTitle, postContent) {
    var imgUrl = $scope.choosedPhoto ? $scope.choosedPhoto.picture : '';
    var imgId = $scope.choosedPhoto ? $scope.choosedPhoto.id : '';
    $http.post('http://localhost:3000/topics.json', {
      topic: {
        title: topicTitle,
        user_id: $scope.userId,
        img_url: imgUrl,
        posts_attributes: [{
          content: postContent,
          user_id: $scope.userId,
          img_id: imgId
        }]
      }
    }).
    success(function(data, status, headers, config) {
      $scope.topicTitle = null;
      $scope.newTopicPostContent = null;
      $scope.choosedPhoto = null;
      $scope.fetchTopics();
    }).
    error(function(data, status, headers, config) {
      console.error(data);
    });
  };

  $scope.fetchPosts = function() {
    /*
    console.log('fetchPosts');
    $http.get('http://localhost:3000/topics/' + $stateParams.topicId + '.json')
    .success(function(data) {
      $scope.topic = data;

      if (!$scope.page) {
        $scope.page = 1;
      } else {
        $scope.page += 1;
      }
      if (!$scope.topic.posts) {
        $scope.topic.posts =[];
      }

      $http.get('http://localhost:3000/posts.json?' + 'topic_id=' + $stateParams.topicId + '&page=' + $scope.page)
      .success(function(data) {
        angular.forEach(data, function(p) {
          $scope.topic.posts.push(p);
        });
      })
      .error(function(data) {
        console.error(data);
      });
    })
    .error(function(data) {
      console.error(data);
    });
    */
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
