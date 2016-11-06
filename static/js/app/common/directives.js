var cd = angular.module('app.common.directives', []);

cd.directive('focusOn', ['$parse', '$timeout', function($parse, $timeout) {
    return {
        link: function(scope, element, attrs) {
            var expr = $parse(attrs.focusOn);
            var delay = parseInt(attrs.focusDelay);
            if (isNaN(delay)) {
                delay = 0;
            }
            scope.$watch(expr, function(value) {
                if (value) {
                    $timeout(function() {
                        element[0].focus();
                    }, delay);
                }
            });
        }
    };
}]);

// directive to validete cpp email form fields
cd.directive('cppEmail', ['$q', '$http', function($q, $http) {
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

// directive to validate form field by comparing it to an expression
cd.directive('compareTo', [function () {
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
