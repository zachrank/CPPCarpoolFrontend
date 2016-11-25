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

cd.directive('stars', ['$parse', function($parse) {
    return {
        restrict: 'A',
        scope: {
            stars: "&stars"
        },
        transclude: true,
        template: '<span class="stars"><span class="star" data-ng-repeat="star in starsArr track by $index" data-ng-class="{ \'full\': star === 2, \'half\': star === 1 }"><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span></span></span>',
        link: function(scope, element, attrs) {
            // float between 0.0 and 5.0
            var numStars = scope.stars() || 0;
            // normalize value
            // ex: 1.0 to 1.2999.. => 1.0, 1.3 to 1.7999.. => 1.5, 1.8 to 2.0 => 2.0
            var numStarsNorm = Math.round(numStars * 2) / 2;

            // build starsArr
            // 0 = empty, 1 = half, 2 = full
            var starsArr = [0, 0, 0, 0, 0];
            var index = 0;
            while (numStars > 0) {
                numStars -= 0.5;
                starsArr[index] += 1;
                if (starsArr[index] === 2) {
                    index++;
                }
            }

            scope.starsArr = starsArr;
        }
    };
}]);
