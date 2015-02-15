describe( 'AppCtrl', function() {
  var AppCtrl, $scope;

  beforeEach( module( 'ngBoilerplate' ) );

  beforeEach( inject( function( $controller, $rootScope, $facebook, $http, $modal, apiServerRoot ) {
    $scope = $rootScope.$new();
    AppCtrl = $controller( 'AppCtrl', { $scope: $scope, $facebook: $facebook, $http: $http, $model: $modal, apiServerRoot: apiServerRoot });
  }));

  it('can be initialized', function() {
    expect( AppCtrl ).toBeTruthy();
  });
});
