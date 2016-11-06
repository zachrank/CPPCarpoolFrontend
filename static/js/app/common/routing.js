var route = angular.module('app.common.routing', []);

// Define all the routes
route.config(['$routeProvider', '$locationProvider', 'routingFactoryProvider', function($routeProvider, $locationProvider, routingFactoryProvider) {
    var routes = {
        '/': {
            'templateUrl': 'partials/home.html',
            'controller': 'homeCtrl',
            'controllerAs': 'homeVm',
            'displayName': 'Home'
        },
        '/login': {
            'templateUrl': 'partials/login.html',
            'controller': 'loginCtrl',
            'controllerAs': 'loginVm'
        },
        '/register': {
            'templateUrl': 'partials/register.html',
            'controller': 'registerCtrl',
            'controllerAs': 'registerVm'
        },
        '/parking': {
            'templateUrl': 'partials/parking.html',
            'controller': 'parkingCtrl',
            'controllerAs': 'parkingVm',
            'displayName': 'Parking'
        },
        '/profile': {
            'auth': true,
            'templateUrl': 'partials/profile.html',
            'controller': 'profileCtrl',
            'controllerAs': 'profileVm'
        }
    };

    routingFactoryProvider.setRoutes(routes);

    for (var r in routes) {
        var route = routes[r];
        $routeProvider.when(r, {
            'templateUrl': route.templateUrl,
            'controller': route.controller,
            'controllerAs': route.controllerAs
        });
    }

    $routeProvider.otherwise('/');
}]);

// Expose the routes to the entire app as a factory
route.provider('routingFactory', [function() {
    var routes = {};

    // This function is only called by the .config module above
    this.setRoutes = function(r) {
        routes = r;
    };

    // define the routingFactory using routes defined in .config module above
    this.$get = [function() {
        var routing = {};

        routing.list = function() {
            return Object.keys(routes);
        };

        routing.get = function(routeName) {
            return routes[routeName];
        };

        routing.requiresAuth = function(routeName) {
            if (typeof routes[routeName] !== 'undefined') {
                return !!routes[routeName].auth;
            }
        };

        return routing;
     }];
}]);


// Listen for route changes so we can check auth
route.run(['$rootScope', '$location', 'authFactory', 'routingFactory', function($rootScope, $location, authFactory, routingFactory) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // Save previous path on the root scope incase we need it later
        if (typeof current !== 'undefined') {
            $rootScope.previousPath = current.$$route.originalPath;
        }

        // Get the next path
        var nextPath = '';
        if (typeof next !== 'undefined') {
            nextPath = next.$$route.originalPath;
        }

        // send user to login page if path requires auth and not logged in
        if (!authFactory.loggedIn() && routingFactory.requiresAuth(nextPath)) {
            event.preventDefault();
            $location.path('/login');
        }
    });

    // Listen for logout event
    $rootScope.$onRootScope('logout', function() {
        // check if path requires auth
        if (routingFactory.requiresAuth($location.$$path)) {
            $location.path('/login');
        }
    });
}]);
