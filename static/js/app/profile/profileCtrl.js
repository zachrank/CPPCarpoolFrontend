var profile = angular.module('app.profile', []);

profile.controller('profileCtrl', ['$scope', '$http', function($scope, $http) {
    var vm = this;
    vm.data = {};

    $http({
        'url': '/api/user/',
        'method': 'GET'
    }).then(function(response) {
        vm.data = response.data;
    }, function(response) {

    });
}]);
