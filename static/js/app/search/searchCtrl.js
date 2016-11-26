var search = angular.module('app.search', []);

search.controller('searchCtrl', ['$scope', '$http', 'authFactory', function($scope, $http, authFactory) {
    var vm = this;
    vm.results = [];
    vm.loading = true;
    vm.error = false;
    vm.profilecomplete = false;
    var dayOfWeekMap = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'
    ];

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
                var r = vm.results[i];
                var atIndex = r.cppemail.indexOf('@');
                r.cppusername = r.cppemail.slice(0, atIndex);

                var processedSched = [];
                for (var j = 0; j < r.schedule.length; j++) {
                    if (r.schedule[j].arrive !== null && r.schedule[j].depart !== null) {
                        processedSched.push({
                            'day': dayOfWeekMap[j],
                            'arrive': r.schedule[j].arrive.slice(0, 5),
                            'depart': r.schedule[j].depart.slice(0, 5)
                        });
                    }
                }
                r.schedule = processedSched;
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
