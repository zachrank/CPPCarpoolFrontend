var profile = angular.module('app.profile', []);

profile.controller('profileCtrl', ['$scope', '$http', '$routeParams', 'authFactory', '$sce', function($scope, $http, $routeParams, authFactory, $sce) {
    var vm = this;
    vm.data = {};
    vm.loading = true;
    vm.error = false;
    vm.myProfile = (authFactory.getUser().cppemail === $routeParams.user + '@cpp.edu');
    vm.tab = 0;
    vm.tabs = [
        'Overview',
        'Reviews',
        'Contact'
    ];
    // maps key usage is restricted to *.cppcarpool.com domains
    var mapsKey = 'AIzaSyCMycxWDmmKHTDK4xTFzgrjTqarniV8LLw';



    $http({
        'url': '/api/user/' + $routeParams.user,
        'method': 'GET'
    }).then(function(response) {
        vm.data = response.data;
        vm.data.stars = [2,2,2,1,0];
        vm.mapsUrl = $sce.trustAsUrl('https://www.google.com/maps/embed/v1/place?key=' + mapsKey + '&q=' + (vm.data.city || 'Cal Poly Pomona'));

        vm.loading = false;
    }, function(response) {
        vm.error = true;
        vm.loading = false;
    });
}]);
