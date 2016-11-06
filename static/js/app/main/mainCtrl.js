var mainCtrl = angular.module('app.main', []);

mainCtrl.controller('mainCtrl', ['$scope', 'authFactory', 'routingFactory', function($scope, authFactory, routingFactory) {
    var vm = this;

    vm.navlinks = [];

    var routeList = routingFactory.list();
    for (var i in routeList) {
        var path = routeList[i];
        var route = routingFactory.get(path);
        if (typeof route.displayName !== 'undefined') {
            vm.navlinks.push({
                'name': route.displayName,
                'path': path
            });
        }
    }

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
