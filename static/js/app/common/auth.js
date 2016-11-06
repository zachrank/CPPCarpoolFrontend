var auth = angular.module('common.auth', []);

auth.factory('authService', [function() {
    var authService = {};
    var token = "";

    if (typeof localStorage !== "undefined" && typeof localStorage.authToken !== "undefined") {
        token = localStorage.authToken;
    }

    authService.getToken = function() {
        return token;
    };

    authService.setToken = function(t) {
        token = t;
        if (typeof localStorage !== "undefined") {
            localStorage.authToken = token;
        }
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
                console.log("unauth");
            }

            return $q.reject(response);
        };

        return interceptor;
}]);

auth.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authHttpInterceptor');
}]);
