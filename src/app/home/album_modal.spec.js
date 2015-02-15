describe( 'AlbumModalCtrl', function() {
  var AlbumModalCtrl, $scope, modalInstance;

  beforeEach( module( 'ngBoilerplate' ) );
  beforeEach( module( 'ngBoilerplate.home' ) );

  beforeEach( inject( function( $controller, $rootScope, $http, $log, $facebook) {
    $scope = $rootScope.$new();
    modalInstance = {
      close: jasmine.createSpy("modalInstance.close"),
      dismiss: jasmine.createSpy("modalInstance.dismiss"),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };

    albums = [];

    AlbumModalCtrl = $controller('AlbumModalCtrl',
      { $scope: $scope,
        $http: $http,
        $modalInstance: modalInstance,
        $log: $log,
        $facebook: $facebook,
        albums: albums }
    );
  }));

  it( 'can be initialized', function() {
    expect( AlbumModalCtrl ).toBeTruthy();
  });

  it("cancelを呼ぶと、modalをdismissすること", function() {
    $scope.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });
});

