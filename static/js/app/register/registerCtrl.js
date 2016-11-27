var register = angular.module('app.register', []);

register.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
    var vm = this;
    vm.loading = false;
    vm.registerSuccess = false;
    vm.registerError = false;
    vm.password = '';
    vm.passwordConfirm = '';

    vm.reg = {
        'email': '',
        'fullname': '',
        'password': '',
    };

    vm.register = function() {
        if (!$scope.registerForm.$valid || vm.loading) {
            return;
        }
        vm.loading = true;

        vm.reg.password = vm.password;

        $http({
            'url': '/api/login/register',
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'data': $.param(vm.reg)
        }).then(function(response) {
            vm.registerSuccess = true;
            vm.registerError = false;
            vm.loading = false;
        }, function(response) {
            vm.registerSuccess = false;
            vm.registerError = true;
            vm.loading = false;
        });
    };
}]);
