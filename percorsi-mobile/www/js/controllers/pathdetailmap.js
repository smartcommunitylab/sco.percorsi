angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, $state, singlePathService, $ionicPlatform, $ionicHistory, leafletData, $filter, mapConversionService, singlePoiService) {
    $scope.path = singlePathService.getSelectedPath();
    var markers = [];
    var boundArray = [];
    for (i = 0; i < $scope.path.pois.length; i++) {
        var latlng = [$scope.path.pois[i].coordinates.lat, $scope.path.pois[i].coordinates.lng];
        boundArray.push(latlng);
        markers.push({
            getMessageScope: function () {
                return $scope;
            },
            lat: $scope.path.pois[i].coordinates.lat,
            lng: $scope.path.pois[i].coordinates.lng,
            message: '<div ng-controller="PathDetailMapCtrl" class="map-balloon">' +
                '<h4>' + $filter('translate_remote')($scope.path.pois[i].title) + '</h4>' +
                '<div class="desc">' + $filter('translate_remote')($scope.path.pois[i].description).substring(0, 200) + '...' + '</div>' +
                '<div class="row">' +
                //                '<div class="col"><button class="button button-percorsi button-block" ng-click="closeWin()">' + $filter('translate')('close') + '</button></div>' +
                '<div class="col"><button class="button button-percorsi button-block" ng-click="detail(' + i + ')">' + $filter('translate')('details') + '</button></div>' +
                '<div class="col"><button class="button button-percorsi button-block" ng-click="bringmethere([' + $scope.path.pois[i].coordinates.lat + ', ' + $scope.path.pois[i].coordinates.lng + '])">' + $filter('translate')('pathdetailmap_goto') + '</button></div>' +
                '</div>' +
                '</div>',
            icon: {
                type: 'div',
                iconSize: [32, 32],
                html: '<p>' + (i + 1) + ' </p><img src="./img/marker_hole.png">',
                popupAnchor: [0, 0]
            }
        });
    };

    $scope.pathMarkers = markers;
    $scope.pathLine = {
        p1: {
            color: 'black',
            weight: 8,
            latlngs: mapConversionService.decode($scope.path.shape)
                // message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
        }
    };
    $scope.back = function () {
        if ($ionicHistory.length > 0) {
            $ionicHistory.goBack();
        } else {
            $state.go('app.pathdetail.info');
            // window.location.assign("#/app/path/info");
        }
    }
    $scope.detail = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.path.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };

    $scope.closeWin = function () {
        leafletData.getMap().then(function (map) {
            map.closePopup();
        });
    };

    if (singlePoiService.getIndexPoi() == null) {
        angular.extend($scope, {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            center: {
                lat: $scope.path.pois[0].coordinates.lat,
                lng: $scope.path.pois[0].coordinates.lng,
                zoom: 14
            },
            markers: $scope.pathMarkers,
            events: {},
            pathLine: $scope.pathLine
        });
    } else {
        angular.extend($scope, {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            center: {
                lat: $scope.path.pois[singlePoiService.getIndexPoi()].coordinates.lat,
                lng: $scope.path.pois[singlePoiService.getIndexPoi()].coordinates.lng,
                zoom: 19
            },
            markers: $scope.pathMarkers,
            events: {},
            pathLine: $scope.pathLine
        });
    };

    leafletData.getMap().then(function (map) {
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);
        map.locate({
            setView: false,
            maxZoom: 8,
            watch: false,
            enableHighAccuracy: true
        });
        if (singlePoiService.getIndexPoi() == null) {

            var bounds = new L.LatLngBounds(boundArray);
            map.fitBounds(bounds, {
                padding: [20, 20]
            });
        }
        map.on('locationfound', onLocationFound);

        function onLocationFound(e) {
            $scope.myloc = e;
            var radius = e.accuracy / 2;
            L.marker(e.latlng).addTo(map);
            //.bindPopup("You are within " + radius + " meters from this point").openPopup();
            L.circle(e.latlng, radius).addTo(map);
        };
    });
    //    leafletData.getMap().then(function (map) {
    //        if (boundArray.length > 0) {
    //            var bounds = new L.LatLngBounds(boundArray);
    //            map.fitBounds(bounds, {
    //                padding: [0, 230]
    //            });
    //        }
    //    });
});
