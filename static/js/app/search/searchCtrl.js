var search = angular.module('app.search', []);

search.controller('searchCtrl', ['$scope', '$http', 'authFactory', function($scope, $http, authFactory) {
    var vm = this;
    vm.results = [];
    vm.loading = true;
    vm.error = false;
    vm.profilecomplete = false;

    function load() {
        var user = authFactory.getUser();
        if (typeof user === "undefined" || !user.profilecomplete) {
            vm.profilecomplete = false;
            return;
        }
        vm.profilecomplete = true;
        vm.loading = true;

        $http({
            'url': '/api/findRides/',
            'method': 'GET'
        }).then(function(response){
            vm.results = response.data.results;
            for (var i = 0; i < vm.results.length; i++) {
                var atIndex = vm.results[i].cppemail.indexOf('@');
                vm.results[i].cppusername = vm.results[i].cppemail.slice(0, atIndex);
            }

            vm.loading = false;
            vm.error = false;
        }, function(response) {
            vm.loading = false;
            vm.error = true;
        });
    }

    load();

    $scope.$onRootScope('userChange', function() {
        load();
    });
}]);
