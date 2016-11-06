var register = angular.module('app.register', []);

register.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
    var vm = this;

    vm.password = '';
    vm.passwordConfirm = '';

    vm.reg = {
        'email': '',
        'fullname': '',
        'password': '',
    };

    vm.register = function() {
        if (!$scope.registerForm.$valid) {
            return;
        }

        vm.reg.password = vm.password;

        $http({
            'url': '/api/login/register',
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'data': $.param(vm.reg)
        }).then(function(response) {
            console.log("registered");
        }, function(response) {
            console.log("err");
        });
    };
}]);
