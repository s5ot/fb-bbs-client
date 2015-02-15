describe('TopicCtrl', function() {
  var ConfirmPostModalCtrl, $scope;

  beforeEach(module('ngBoilerplate'));
  beforeEach(module('ngBoilerplate.home'));

  beforeEach(inject(function($controller, $rootScope, $http, $modal, $log, $facebook, Reddit, $stateParams, $state, apiServerRoot) {
    $scope = $rootScope.$new();

    albums = [];

    TopicCtrl = $controller('TopicCtrl',
      { $scope: $scope,
        $http: $http,
        $modal: $modal,
        $log: $log,
        $facebook: $facebook,
        Reddit: Reddit,
        $stateParams: $stateParams,
        $state: $state,
        apiServerRoot: apiServerRoot
      }
    );
  }));

  it('can be initialized', function() {
    expect(TopicCtrl).toBeTruthy();
  });
});

