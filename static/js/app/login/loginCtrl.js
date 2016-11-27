var loginCtrl = angular.module('app.login', []);

loginCtrl.controller('loginCtrl', ['$scope', '$rootScope', '$http', 'authFactory', function($scope, $rootScope, $http, authFactory) {
    var vm = this;
    vm.state = 0;

    if (authFactory.loggedIn()) {
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
                if (typeof vm.loginData.picture !== 'undefined' && vm.loginData.picture !== null) {
                    vm.loginData.picture = 'data:image/jpeg;base64,' + vm.loginData.picture;
                }
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
                authFactory.setToken(response.data.token);
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
        vm.error = false;
        vm.errorText = '';
        vm.loginData = null;
    };

}]);
