describe( 'DetailCtrl', function() {
  var DetailCtrl, $scope;

  beforeEach( module( 'ngBoilerplate' ) );
  beforeEach( module( 'ngBoilerplate.detail' ) );

  beforeEach( inject( function( $controller, $rootScope, $http, $modal, $log, $facebook, $stateParams, Reddit, $state, apiServerRoot) {
    $scope = $rootScope.$new();
    DetailCtrl = $controller( 'DetailCtrl', { $scope: $scope, $http: $http, $model: $modal, $log: $log, $facebook: $facebook, $stateParams: $stateParams, Reddit: Reddit, $state: $state, apiServerRoot: apiServerRoot });
  }));

  it( 'can be initialized', inject( function() {
    expect( DetailCtrl ).toBeTruthy();
  }));
});

