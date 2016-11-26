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

    function parseTime(t) {
        var split = t.split(':');
        hour = parseInt(split[0]);
        minute = split[1];
        suffix = " am";
        if (hour > 11 && hour !== 24) {
            suffix = " pm";
        }
        if (hour > 12) {
            hour -= 12;
        }
        return hour + ":" + minute + suffix;
    }

    function load() {
        var user = authFactory.getUser();
        if (typeof user === "undefined" || !user.profilecomplete) {
            vm.profilecomplete = false;
            return;
        }
        vm.profilecomplete = true;
        vm.loading = true;

        $http({
            'url': '/api/search/',
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
                            'arrive': parseTime(r.schedule[j].arrive),
                            'depart': parseTime(r.schedule[j].depart)
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
