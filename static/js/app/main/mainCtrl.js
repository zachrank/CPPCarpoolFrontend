var mainCtrl = angular.module('app.main', []);

mainCtrl.controller('mainCtrl', ['$scope', 'authFactory', function($scope, authFactory) {
    var vm = this;

    vm.navlinks = [
        {
            "text": "Home",
            "href": "#/"
        }
    ];

    vm.user = authFactory.getUser();
    $scope.$onRootScope('userChange', function() {
        vm.user = authFactory.getUser();
    });

    vm.loggedIn = authFactory.loggedIn;
    vm.logout = function() {
        authFactory.logout();
        window.location.reload();
    };
}]);
