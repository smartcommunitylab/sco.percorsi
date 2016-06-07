angular.module('roveretoPercorsi.controllers.pathdetailnear', [])

.controller('PathDetailNearCtrl', function ($scope, $rootScope, $http, $ionicPopup, $ionicModal, singlePathService, $filter, $ionicHistory, GeoLocate, mapService, $ionicLoading, Toast, leafletData) {
    $scope.path = singlePathService.getSelectedPath();
    $scope.emptylist = false;
    $scope.selectedplace = {};


    $scope.back = function () {
        $ionicHistory.goBack();
    }
    $scope.openFbPlace = function (id) {
        window.open('http://www.facebook.com/' + id, '_system', 'location=yes');
    }
    var calculateCenterOfPath = function (listOfPoints) {
        if (listOfPoints.length == 1) {
            return listOfPoints[0];
        }
        var x = 0;
        var y = 0;
        var z = 0;
        for (var k = 0; k < listOfPoints.length; k++) {
            var latitude = listOfPoints[k].coordinates.lat * Math.PI / 180;
            var longitude = listOfPoints[k].coordinates.lng * Math.PI / 180;
            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        }


        var total = listOfPoints.length;

        x = x / total;
        y = y / total;
        z = z / total;

        var centralLongitude = Math.atan2(y, x);
        var centralSquareRoot = Math.sqrt(x * x + y * y);
        var centralLatitude = Math.atan2(z, centralSquareRoot);

        return [centralLatitude * 180 / Math.PI, centralLongitude * 180 / Math.PI];
    }
    $scope.getPlacesAround = function () {
        $ionicLoading.show();
        var centerOfPath = calculateCenterOfPath(singlePathService.getSelectedPath().pois)
        singlePathService.getPlacesAround(centerOfPath[0], centerOfPath[1], "Restaurant/cafe,Bar").then(function (places) {
            $scope.places = places;
            if (places.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }
            $ionicLoading.hide();
        }, function (error) {
            $scope.emptylist = true;
            $ionicLoading.hide();
            Toast.show($filter('translate')('places_empty_error'), 'short', 'bottom');
        });
    }
    $ionicModal.fromTemplateUrl('templates/placeModal.html', {
        id: '1',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalMap = modal;
    });

    angular.extend($scope, {
        center: {
            lat: 0,
            lng: 0,
            zoom: 14
        },
        //        markers: $scope.pathMarkers,
        events: {},
        markers: {},
        pathLine: {}
    });
    mapService.initMap('modalMap').then(function () {
        //add polyline
    });
    $scope.initmap = function () {
        mapService.initMap('modalMap').then(function () {
            //add polyline
        });
    }
    $scope.openMapPlace = function (place) {

        $scope.markers = {

            stop: {
                lat: Number(place.location.latitude),
                lng: Number(place.location.longitude),
                icon: {
                    popupAnchor: [12, 0]
                },
                getMessageScope: function () {
                    return $scope;
                },
                //focus: true,
                message: '<div ng-controller="PathDetailNearCtrl" class="map-balloon">' +
                    '<h4 class="text-pop-up">' + place.name + '</h4>' +
                    '<div class="row">' +
                    '<div class="col"><button class="button button-percorsi button-balloon button-block" ng-click="bringmethere([' + Number(place.location.latitude) + ', ' + Number(place.location.longitude) + '])">' + '<i class="icon ion-android-navigate"></i>' + '</button></div>' +
                    '</div>' +
                    '</div>'
            }
        }

        $scope.modalMap.show().then(function () {
            var boundsArray = [];
            var boundstart = [$scope.markers.stop.lat, $scope.markers.stop.lng];
            boundsArray.push(boundstart);

            mapService.getMap('modalMap').then(function (map) {

                $scope.center.lat = Number(place.location.latitude);
                $scope.center.lng = Number(place.location.longitude);
                var bounds = new L.LatLngBounds(boundsArray);
                map.fitBounds(bounds, {
                    padding: [20, 20]
                });
                GeoLocate.locate().then(function (myposition) {
                        //add filed distance from me to all paths
                        //                        $scope.myloc = myposition;
                        //                        var radius = e.accuracy / 2;
                        //                        L.marker(e.latlng).addTo(map);
                        //                        L.circle(e.latlng, radius).addTo(map);
                        L.marker(L.latLng(myposition[0], myposition[1])).addTo(map);
                    },
                    function (error) {
                        //resolve without new field but hide distance and option in sorting menu

                    });


            });
        });
    }
    $scope.closeMap = function () {
        $scope.modalMap.hide();
    }




    var markers = [];
    var boundArray = [];


});
