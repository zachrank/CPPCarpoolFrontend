var settings = angular.module('app.settings', []);

settings.controller('settingsCtrl', ['$scope', '$http', 'authFactory', function($scope, $http, authFactory) {
    var vm = this;
    vm.error = false;
    vm.loading = false;
    vm.uploading = false;
    vm.tab = 0;

    vm.data = authFactory.getUser();
    $scope.$onRootScope('userChange', function() {
        vm.data = authFactory.getUser();
    });

    vm.setTab = function(tab) {
        vm.tab = tab;
    };

    vm.uploadPicture = function() {
        if (vm.uploading) {
            return;
        }
        var uploadElm = document.getElementById("hidden-file-upload");
        uploadElm.click();

        uploadElm.onchange = function() {
            if ('files' in uploadElm) {
                if (uploadElm.files.length === 0) {
                    console.log("select 1 file");
                } else {
                    var file = uploadElm.files[0];
                    var payload = new FormData();
                    payload.append('picture', file);

                    // set state
                    vm.uploading = true;

                    // send data to server
                    $http({
                        'url': '/api/settings/picture',
                        'method': 'POST',
                        // browser will automatically set content type
                        'headers': {'Content-Type': undefined},
                        'data': payload
                    }).then(function(response) {
                        load(true);
                    }, function(response) {
                        vm.uploading = false;
                        vm.uploadError = true;
                    });
                }
            } else {
                if (uploadElm.value === "") {
                    console.log("please select a file");
                } else {
                    console.log("not supported");
                }
            }
        };
    };

    var load = function(silent) {
        vm.loading = !silent;
        $http({
            'url': '/api/user/',
            'method': 'GET'
        }).then(function(response) {
            authFactory.setUser(response.data);
            vm.uploading = false;
            vm.uploadError = false;
            vm.loading = false;
            vm.error = false;
        }, function(response) {
            vm.error = true;
            vm.loading = false;
        });
    };
}]);
