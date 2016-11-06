var auth = angular.module('common.auth', []);

auth.factory('authService', ['$rootScope', '$injector', function($rootScope, $injector) {
    var authService = {};
    var token = "";
    var user = {};

    if (typeof localStorage !== "undefined" && typeof localStorage.authToken !== "undefined") {
        token = localStorage.authToken;
    }

    authService.getUser = function() {
        return user;
    };

    authService.setUser = function (u) {
        user = u;
        $rootScope.$emit('userChange');
    };

    authService.getToken = function() {
        return token;
    };

    authService.setToken = function(t) {
        token = t;
        if (typeof localStorage !== "undefined") {
            localStorage.authToken = token;
        }
        $rootScope.$emit('tokenChange');
    };

    authService.logout = function() {
        user = {};
        token = "";
        delete localStorage.authToken;
        $rootScope.$emit('logout');
        $rootScope.$emit('userChange');
    };

    authService.loggedIn = function() {
        return token.length > 0;
    };

    return authService;
}]);

auth.factory('authHttpInterceptor', ['$q', 'authService', function($q, authService) {
        var interceptor = {};

        interceptor.request = function(config) {
            if (config.noAuth) {
                return config;
            }

            config.headers = config.headers || {};
            if (authService.loggedIn()) {
                config.headers.Authorization = 'Bearer ' + authService.getToken();
            }

            return config;
        };

        interceptor.response = function(response) {
            var renew = response.headers("renew-token");
            if (renew) {
                authService.setToken(renew);
            }

            return response;
        };

        interceptor.responseError = function(response) {
            if (authService.loggedIn() && (response.status == 401 || response.status == 403)) {
                authService.logout();
            }

            return $q.reject(response);
        };

        return interceptor;
}]);

auth.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authHttpInterceptor');
}]);

auth.run(['authService', '$http', function(authService, $http) {
    // fetch user info from server if logged in
    if (authService.loggedIn()) {
        $http({
            'url': '/api/user',
            'method': 'GET'
        }).then(function(response) {
            authService.setUser(response.data);
        }, function(response) {
            authService.logout();
        });
    }
}]);
