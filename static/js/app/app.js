app = angular.module('cppcarpool', [
    'ngRoute',
    'app.controllers.main',
    'app.controllers.home',
    'app.controllers.login'
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
    }).otherwise('/');
}]);
