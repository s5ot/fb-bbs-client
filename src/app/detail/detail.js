angular.module('ngBoilerplate.detail', [
  'ui.router',
  'plusOne',
  'ngFacebook'
])

.controller('DetailCtrl', function DetailController($scope, $http, $modal, $log, $facebook, $stateParams) {
  console.log('detail');

  $scope.fetchPosts = function() {
    $http.get('http://localhost:3000/topics/' + $stateParams.topicId + '.json').success(function(data) {
      $scope.topic = data;
    })
    .error(function(data) {
      console.error(data);
    });
  };
});
