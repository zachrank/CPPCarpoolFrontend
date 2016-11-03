var mainCtrl = angular.module('app.controllers.main', []);

mainCtrl.controller('mainCtrl', ['$scope', function($scope) {
    var vm = this;

    vm.navlinks = [
        {
            "text": "login",
            "href": "#login"
        }
    ];
}]);
