var cd = angular.module('common.directives', []);

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
