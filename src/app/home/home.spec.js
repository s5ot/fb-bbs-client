describe( 'home section', function() {
  var HomeCtrl, $scope;

  beforeEach( module( 'ngBoilerplate' ) );
  beforeEach( module( 'ngBoilerplate.home' ) );
  beforeEach( module( 'ui.bootstrap' ) );

  beforeEach( inject( function( $controller, $rootScope, $http, $modal, $log, $facebook, apiServerRoot) {
    $scope = $rootScope.$new();
    HomeCtrl = $controller( 'HomeCtrl', { $scope: $scope, $http: $http, $model: $modal, $log: $log, $facebook: $facebook, apiServerRoot: apiServerRoot});
  }));

  it('can be initialized', function() {
    expect( HomeCtrl ).toBeTruthy();
  });
});

