var mainCtrl = angular.module('controllers.main', []);

mainCtrl.controller('mainCtrl', ['$scope', 'authService', function($scope, authService) {
    var vm = this;

    vm.navlinks = [
        {
            "text": "Home",
            "href": "#/"
        }
    ];

    vm.loggedIn = authService.loggedIn;
    vm.logout = function() {
        authService.logout();
        window.location.reload();
    };
}]);
