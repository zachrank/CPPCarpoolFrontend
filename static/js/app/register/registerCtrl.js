var registerCtrl = angular.module('controllers.register', []);

registerCtrl.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
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

registerCtrl.directive('cppEmail', ['$q', '$http', function($q, $http) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.cppEmail = function(modelValue, viewValue) {
                var def = $q.defer();

                $http({
                    'url': '/api/login/check',
                    'method': 'POST',
                    'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
                    'data': $.param({'email': modelValue})
                }).then(function() {
                    def.reject();
                }, function() {
                    def.resolve();
                });

                return def.promise;
            };
        }
    };
}]);

registerCtrl.directive('compareTo', [function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);
