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
    }).otherwise('/');
}]);
