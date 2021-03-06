var settings = angular.module('app.settings', []);

settings.controller('settingsCtrl', ['$scope', '$http', '$timeout', 'authFactory', function($scope, $http, $timeout, authFactory) {
    var vm = this;

    vm.tab = 0;
    vm.days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    var copyUserInfo = function() {
        vm.myUser = angular.copy(authFactory.getUser());
        if (typeof vm.myUser.id === "undefined") {
            return;
        }
    };

    copyUserInfo();
    $scope.$onRootScope('userChange', function() {
        copyUserInfo();
    });

    //for displaying messages and errors
    vm.formErrorText = "";
    vm.formMessageText = "";
    // for loading user data
    vm.error = false;
    vm.loading = false;
    // for picture upload
    vm.uploading = false;
    vm.uploadError = false;
    // for saving user data
    vm.saving = false;
    vm.saveError = false;
    // for conversations
    vm.convs = [];
    vm.loadingAllConvs = false;
    vm.totalUnread = 0;
    // for single conversation
    vm.loadingConv = true;
    vm.showingConv = null;
    vm.messages = [];
    vm.sending = false;
    vm.messageText = "";
    vm.messageErrorOverlay = "";
    vm.messageError = "";

    $scope.$onRootScope('userChange', function() {
        vm.data = authFactory.getUser();
        vm.editData = angular.copy(vm.data);
        // remove picture
        delete vm.editData.picture;
        // preprocess schedule
        for (var i = 0; i < vm.editData.schedule.length; i++) {
            var day = vm.editData.schedule[i];
            if (day.arrive === null || day.depart === null) {
                continue;
            }

            day.checked = true;

            var arriveSplit = day.arrive.split(':');
            day.arriveHour = parseInt(arriveSplit[0]);
            day.arriveMinute = parseInt(arriveSplit[1]);
            day.arrivePeriod = 'am';
            if (day.arriveHour >= 12) {
                day.arrivePeriod = 'pm';
            }
            if (day.arriveHour > 12) {
                day.arriveHour -= 12;
            }

            // convert to string and pad with 0's
            day.arriveMinute = '' + day.arriveMinute;
            if (day.arriveMinute.length === 1) {
                day.arriveMinute = '0' + day.arriveMinute;
            }

            var departSplit = day.depart.split(':');
            day.departHour = parseInt(departSplit[0]);
            day.departMinute = parseInt(departSplit[1]);
            day.departPeriod = 'am';
            if (day.departHour >= 12) {
                day.departPeriod = 'pm';
            }
            if (day.departHour > 12) {
                day.departHour -= 12;
            }

            // convert to string and pad with 0's
            day.departMinute = '' + day.departMinute;
            if (day.departMinute.length === 1) {
                day.departMinute = '0' + day.departMinute;
            }
        }
    });

    vm.setTab = function(tab) {
        vm.tab = tab;
        if (tab === 1) {
            fetchAllConversations();
        }
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
                        // do a silent reload of user data to get picture
                        // the load function will reset vm.uploading and vm.uploadError
                        load(true);
                        vm.formErrorText = "";
                    }, function(response) {
                        vm.uploading = false;
                        vm.uploadError = true;
                        showError("Error uploading profile picture.");
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

    vm.save = function() {
        if (!$scope.locationForm.$valid) {
            showError("Invalid location information.");
            return;
        }

        if (!$scope.scheduleForm.$valid) {
            showError("Invalid schedule.");
            return;
        }

        if (!$scope.prefForm.$valid) {
            showError("Invalid preferences.");
            return;
        }

        // parse schedule data
        var parsedSchedule = [];
        for (var i = 0; i < vm.editData.schedule.length; i++) {
            var day = vm.editData.schedule[i];
            var parsedDay = {
                'arrive': null,
                'depart': null
            };

            if (day.checked) {
                var error = false;
                try {
                    var arrH = parseInt(day.arriveHour);
                    var arrM = parseInt(day.arriveMinute);
                    if (arrH > 23 || arrM > 59) {
                        error = true;
                    }
                    if (day.arrivePeriod == 'pm') {
                        if (arrH !== 12) {
                            arrH += 12;
                        }
                    }
                    parsedDay.arrive = arrH + ':' + arrM + ':00';

                    var depH = parseInt(day.departHour);
                    var depM = parseInt(day.departMinute);
                    if (depH > 23 || depM > 59) {
                        error = true;
                    }
                    if (day.departPeriod == 'pm') {
                        if (depH !== 12) {
                            depH += 12;
                        }
                    }
                    parsedDay.depart = depH + ':' + depM + ':00';
                } catch (e) {
                    error = true;
                }

                if (error) {
                    showError("Invalid schedule.");
                    return;
                }
            }

            parsedSchedule.push(parsedDay);
        }

        // verify and parse preferences
        try {
            vm.editData.drivingpref = parseInt(vm.editData.drivingpref);
            vm.editData.maxdist = parseInt(vm.editData.maxdist);
        } catch (e) {
            showError("Invalid preferences.");
            return;
        }

        var submitData = angular.copy(vm.editData);
        submitData.schedule = JSON.stringify(parsedSchedule);

        if (vm.saving) {
            return;
        }
        vm.saving = true;

        $http({
            'url': '/api/settings/',
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'data': $.param(submitData)
        }).then(function(response) {
            vm.formErrorText = "";
            var text = "Save successful!";
            if (!vm.data.profilecomplete) {
                text += " Profile complete.";
            }
            showMessage(text);
            vm.saving = false;
            vm.saveError = false;

            // load back fresh user data
            load();
        }, function(response) {
            showError("Error saving profile!");
            vm.formMessageText = "";
            vm.saving = false;
            vm.saveError = true;
        });
    };

    vm.trySelectDay = function(day) {
        if (!day.checked) {
            day.checked = true;
        }
    };

    var showError = function(message) {
        vm.formErrorText = message;
        $("html, body").animate({ scrollTop: 0 }, 200);
    };

    var showMessage = function(message) {
        vm.formMessageText = message;
        $("html, body").animate({ scrollTop: 0 }, 200);
    };

    var fetchAllConversations = function() {
        if (vm.loadingAllConvs) {
            return;
        }
        vm.loadingAllConvs = true;

        $http({
            'url': '/api/messages/conversations',
            'method': 'GET'
        }).then(function(response) {
            vm.convs = response.data.results;
            vm.totalUnread = 0;
            for (var i = 0; i < vm.convs.length; i++) {
                if (vm.convs[i].unread > 0) {
                    vm.totalUnread++;
                }
            }
            vm.loadingAllConvs = false;
        }, function(response) {
            vm.loadingAllConvs = false;
            vm.totalUnread = 0;
        });
    };
    fetchAllConversations();

    vm.showConv = function(conv) {
        vm.showingConv = conv;
        fetchConv(conv);
    };

    var fetchConv = function(conv) {
        vm.loadingConv = true;
        $http({
            'url': '/api/messages/' + conv.cppemail.split('@')[0],
            'method': 'GET'
        }).then(function(response) {
            vm.messages = response.data.results;
            vm.sending = false;
            vm.loadingConv = false;
            $timeout(function() {
                $('.profile-messages-scrollport').scrollTop($('.profile-messages-scrollport')[0].scrollHeight);
            });
        }, function(response) {
            vm.messageErrorOverlay = "Error fetching messages.";
            vm.sending = false;
            vm.loadingConv = false;
        });
    };

    vm.sendMessage = function() {
        if (vm.messageText.length === 0 || vm.sending) {
            return;
        }
        vm.sending = true;
        var messageTextRemember = vm.messageText;
        vm.messageText = "";

        $http({
            'url': '/api/messages/',
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'data': $.param({
                'to_userid': vm.showingConv.id,
                'message': messageTextRemember
            })
        }).then(function(response) {
            fetchConv(vm.showingConv);
        }, function(response) {
            vm.messageText = messageTextRemember;
            vm.messageError = "Error sending message.";
            vm.sending = false;
        });
    };

    vm.messageKeypress = function(event) {
        if (event.which === 13) {
            vm.sendMessage();
        }
    };

    vm.backToConvs = function() {
        // reset state
        vm.loadingConv = false;
        vm.showingConv = null;
        vm.messages = [];
        vm.sending = false;
        vm.messageText = "";
        vm.messageErrorOverlay = "";
        vm.messageError = "";
        fetchAllConversations();
    };

    var load = function(silent) {
        vm.loading = !silent;
        $http({
            'url': '/api/user/',
            'method': 'GET'
        }).then(function(response) {
            // this will cause a userchange event to fire
            // the event will be picked up by the listener at the top
            authFactory.setUser(response.data);
            vm.loading = false;
            vm.error = false;
            vm.uploading = false;
            vm.uploadError = false;
        }, function(response) {
            vm.error = true;
            vm.loading = false;
            vm.uploading = false;
            vm.uploadError = false;
        });
    };
    load();
}]);
