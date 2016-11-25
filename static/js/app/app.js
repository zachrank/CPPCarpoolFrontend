app = angular.module('cppcarpool', [
    //first party
    'ngRoute',
    // app
    'app.main',
    'app.home',
    'app.login',
    'app.register',
    'app.profile',
    'app.parking',
    'app.search',
    'app.common.auth',
    'app.common.directives',
    'app.common.routing'
]);

app.config(['$provide', function($provide){
    $provide.decorator('$rootScope', ['$delegate', function($delegate){
        $delegate.constructor.prototype.$onRootScope = function(name, listener){
            var unsubscribe = $delegate.$on(name, listener);
            this.$on('$destroy', unsubscribe);
        };

        return $delegate;
    }]);
}]);
