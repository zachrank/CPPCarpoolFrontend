var profile = angular.module('app.profile', []);

profile.controller('profileCtrl', ['$scope', '$http', '$routeParams', 'authFactory', '$sce', '$q', function($scope, $http, $routeParams, authFactory, $sce, $q) {
    var vm = this;
    vm.data = null;
    vm.loading = true;
    vm.error = false;
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

    var copyUserInfo = function() {
        vm.myUser = angular.copy(authFactory.getUser());
        if (typeof vm.myUser.id === "undefined") {
            return;
        }
        vm.myProfile = (vm.myUser.cppemail === $routeParams.user + '@cpp.edu');
        var processedSched = [];
        for (var j = 0; j < vm.myUser.schedule.length; j++) {
            if (vm.myUser.schedule[j].arrive !== null && vm.myUser.schedule[j].depart !== null) {
                processedSched.push({
                    'day': dayOfWeekMap[j],
                    'arrive': parseTime(vm.myUser.schedule[j].arrive),
                    'depart': parseTime(vm.myUser.schedule[j].depart)
                });
            }
        }
        vm.myUser.schedule = processedSched;
    };

    copyUserInfo();
    $scope.$onRootScope('userChange', function() {
        copyUserInfo();
    });

    vm.tab = 0;
    vm.tabs = [
        'Overview',
        'Reviews',
        'Contact'
    ];
    // maps key usage is restricted to *.cppcarpool.com domains
    var mapsKey = 'AIzaSyCMycxWDmmKHTDK4xTFzgrjTqarniV8LLw';

    var reset = function() {
        vm.reviewing = false;
        vm.newReviewStars = 0;
        vm.newReviewStarsDisplay = 0;
        vm.newReviewContent = "";
        vm.reviewError = "";
    };
    reset();

    vm.setTab = function(tab) {
        vm.tab = tab;
        reset();
    };

    vm.submitReview = function() {
        if (vm.newReviewStars < 1 || vm.newReviewStars > 5) {
            vm.reviewError = "please rate 1 - 5 stars.";
            return;
        }

        if (vm.newReviewContent.trim().length === 0) {
            vm.reviewError = "missing review content.";
            return;
        }

        $http({
            'url': '/api/review/',
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'data': $.param({
                'email': $routeParams.user + '@cpp.edu',
                'stars': vm.newReviewStars,
                'content': vm.newReviewContent
            })
        }).then(function(response) {
            vm.reviewError = "";
            vm.reviewing = false;
            load();
        }, function(response) {
            vm.reviewError = response.data;
        });
    };

    vm.deleteReview = function(id) {
        $http({
            'url': '/api/review/' + id,
            'method': 'DELETE'
        }).then(function(response) {
            load();
        }, function(response) {

        });
    };

    var load = function() {
        var userInfoRequest = $http({
            'url': '/api/user/' + $routeParams.user,
            'method': 'GET'
        });

        var reviewsRequest = $http({
            'url': '/api/review/' + $routeParams.user,
            'method': 'GET'
        });

        $q.all([userInfoRequest, reviewsRequest]).then(function(responses) {
            var userInfoResponse = responses[0];
            var reviewsResponse = responses[1];

            // make user info available
            vm.data = userInfoResponse.data;
            vm.mapsUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=' + mapsKey + '&q=' + (vm.data.city || 'Cal Poly Pomona'));
            // make reviews data available
            vm.data.reviews = reviewsResponse.data.results;
            //calculate number of stars
            vm.data.stars = 0.0;
            if (vm.data.reviews.length > 0) {
                var total = 0;
                for (var i = 0; i < vm.data.reviews.length; i++) {
                    total += vm.data.reviews[i].stars;
                }
                vm.data.stars = total / vm.data.reviews.length;
            }

            // process schedule
            var processedSched = [];
            for (var j = 0; j < vm.data.schedule.length; j++) {
                if (vm.data.schedule[j].arrive !== null && vm.data.schedule[j].depart !== null) {
                    processedSched.push({
                        'day': dayOfWeekMap[j],
                        'arrive': parseTime(vm.data.schedule[j].arrive),
                        'depart': parseTime(vm.data.schedule[j].depart)
                    });
                }
            }
            vm.data.schedule = processedSched;

            vm.loading = false;
        }, function() {
            vm.error = true;
            vm.loading = false;
        });
    };

    load();
}]);
