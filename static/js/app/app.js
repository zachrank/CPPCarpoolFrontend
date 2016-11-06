app = angular.module('cppcarpool', [
    'ngRoute',
    'controllers.main',
    'controllers.home',
    'controllers.login',
    'controllers.register',
    'common.auth',
    'common.directives'
])
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl',
        controllerAs: 'homeVm'
    })
    .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl',
        controllerAs: 'loginVm'
    })
    .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'registerCtrl',
        controllerAs: 'registerVm'
    })
    .otherwise('/');
}]).run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
    var authRequired = [
        '/'
    ];

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof current !== 'undefined') {
            $rootScope.previousPath = current.$$route.originalPath;
        }

        var nextPath = '';
        if (typeof next !== 'undefined') {
            nextPath = next.$$route.originalPath;
        }

        if (!authService.loggedIn() && authRequired.indexOf(nextPath) !== -1) {
            event.preventDefault();
            $location.path('/login');
        }
    });
}]);
