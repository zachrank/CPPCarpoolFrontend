var loginCtrl = angular.module('controllers.login', []);

loginCtrl.controller('loginCtrl', ['$scope', '$rootScope', '$http', 'authService', function($scope, $rootScope, $http, authService) {
    var vm = this;
    vm.state = 0;

    if (authService.loggedIn()) {
        window.location = '#/';
    }

    vm.next = function() {
        if (vm.working) {
            return;
        }
        vm.working = true;

        if (vm.state === 0) {
            $http({
                'url': '/api/login/check',
                'method': 'POST',
                'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
                'data': $.param({'email': vm.loginEmail})
            }).then(function(response) {
                vm.state = 1;
                vm.loginData = response.data;
                vm.error = false;
                vm.working = false;
            }, function(response) {
                vm.error = true;
                vm.errorText = "Account does not exist.";
                vm.working = false;
            });
        } else if (vm.state === 1) {
            $http({
                'url': '/api/login/',
                'method': 'POST',
                'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
                'data': $.param({'email': vm.loginEmail, 'password': vm.loginPassword})
            }).then(function(response) {
                authService.setToken(response.data.token);
                delete response.data.token;
                authService.setUser(response.data);
                vm.error = false;
                vm.working = false;

                var toPath = $rootScope.previousPath;
                if (!toPath || toPath === '/login' || toPath === '/register') {
                    toPath = '/';
                }
                window.location = '#' + toPath;
            }, function(response) {
                vm.error = true;
                vm.errorText = "Wrong password.";
                vm.working = false;
            });
        }
    };

    vm.inputKeypress = function(event) {
        if (event.which === 13) {
            vm.next();
        }
    };

    vm.back = function() {
        vm.state = 0;
        vm.loginPassword = '';
        vm.loginData = null;
    };

}]);
