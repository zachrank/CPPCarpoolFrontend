var search = angular.module('app.search', []);

search.controller('searchCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.results = [{
        'cppusername': 'cthill',
        'fullname': 'James Polk',
        'stars': 5,
        'reviews': [{}],
        'distance': 13
    }, {
        'cppusername': 'cthill',
        'fullname': 'Osama bin Laden',
        'stars': 1,
        'reviews': [{}, {}],
        'distance': 20
    }];
}]);
