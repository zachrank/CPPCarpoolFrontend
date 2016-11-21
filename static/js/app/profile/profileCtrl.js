var profile = angular.module('app.profile', []);

profile.controller('profileCtrl', ['$scope', '$http', '$routeParams', 'authFactory', function($scope, $http, $routeParams, authFactory) {
    var vm = this;
    vm.data = {};
    vm.loading = true;
    vm.error = false;
    vm.myProfile = (authFactory.getUser().cppemail === $routeParams.user + '@cpp.edu');

    $http({
        'url': '/api/user/' + $routeParams.user,
        'method': 'GET'
    }).then(function(response) {
        vm.data = response.data;
        vm.data.stars = [2,2,2,1,0];
        vm.loading = false;
    }, function(response) {
        vm.error = true;
        vm.loading = false;
    });
}]);
