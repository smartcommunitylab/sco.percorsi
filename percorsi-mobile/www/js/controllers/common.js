angular.module('roveretoPercorsi.controllers.common', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicHistory, $timeout, $filter) {
    // Modal 1
    $ionicModal.fromTemplateUrl('templates/login.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/credits.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal2 = modal;
    });

    $scope.openModal = function (index) {
        if (index == 1) $scope.oModal1.show();
        else $scope.oModal2.show();
    };

    $scope.closeModal = function (index) {
        if (index == 1) $scope.oModal1.hide();
        else $scope.oModal2.hide();
    };

    $scope.openSignal = function () {
        segnalaService.setSignal(null);
        window.location.assign("#/app/segnala/");
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    };

    /* Listen for broadcasted messages */
    $scope.openLoginPopUp = function () {
        Toast.show($filter('translate')("toast_must_login"), "short", "bottom");


    };

    $scope.$on('modal.shown', function (event, modal) {
        console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function (event, modal) {
        console.log('Modal ' + modal.id + ' is hidden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope 
    // and removing the scope from its parent.
    $scope.$on('$destroy', function () {
        console.log('Destroying modals...');
        $scope.oModal1.remove();
        $scope.oModal2.remove();
    });

    /* Utils */
    $scope.m2km = function (m) {
        return Math.round((m / 1000) * 10) / 10;
    }

    $scope.min2time = function (min) {
        return Math.floor(min / 60) + ':' + min % 60;
    }

    $scope.youtubeEmbed = function (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            /*return 'http://img.youtube.com/vi/' + match[7] + '/0.jpg';*/
            return 'http://img.youtube.com/vi/' + match[7] + '/hqdefault.jpg';
            /*return 'http://img.youtube.com/vi/' + match[7] + '/mqdefault.jpg';*/
        } else {
            return null;
        }
    }

    $scope.window = {
        open: function (url, target) {
            window.open(url, target);
        }
    };
})

.factory('Toast', function ($rootScope, $timeout, $ionicPopup, $cordovaToast) {
    return {
        show: function (message, duration, position) {
            message = message || "There was a problem...";
            duration = duration || 'short';
            position = position || 'top';

            if (!!window.cordova) {
                // Use the Cordova Toast plugin
                $cordovaToast.show(message, duration, position);
            } else {
                if (duration == 'short') {
                    duration = 2000;
                } else {
                    duration = 5000;
                }

                var myPopup = $ionicPopup.show({
                    template: "<div class='toast'>" + message + "</div>",
                    scope: $rootScope,
                    buttons: []
                });

                $timeout(function () {
                    myPopup.close();
                }, duration);
            }
        }
    };
});


function showNoPlace() {
    var alertPopup = $ionicPopup.alert({
        title: $filter('translate')("signal_send_no_place_title"),
        template: $filter('translate')("signal_send_no_place_template"),
        buttons: [
            {
                text: $filter('translate')("signal_send_toast_alarm"),
                type: 'button-custom'
            }
        ]
    });

    alertPopup.then(function (res) {
        console.log('no place');
    });
};

function showNoConnection() {
    var alertPopup = $ionicPopup.alert({
        title: $filter('translate')("signal_send_no_connection_title"),
        template: $filter('translate')("signal_send_no_connection_template"),
        buttons: [
            {
                text: $filter('translate')("signal_send_toast_alarm"),
                type: 'button-custom'
            }
        ]
    });

    alertPopup.then(function (res) {
        console.log('no place');
    });
};

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
};
