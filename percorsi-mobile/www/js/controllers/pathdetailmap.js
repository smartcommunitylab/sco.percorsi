angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, singlePathService, $ionicPlatform, leafletData, $filter, mapConversionService, singlePoiService) {
    $scope.path = singlePathService.getSelectedPath();
    var markers = [];
    for (i = 0; i < $scope.path.pois.length; i++) {
        markers.push({
            lat: $scope.path.pois[i].coordinates.lat,
            lng: $scope.path.pois[i].coordinates.lng,
            message: '<div ng-controller="PathDetailMapCtrl">' +
                '<div><label><strong> <i>' + $filter('translate_remote')($scope.path.pois[i].title) + '</i></strong></label></div>' +
                '<div><label>' + $filter('translate_remote')($scope.path.pois[i].description) + '</i></label></div>' +
                '<div align="center" style="white-space:nowrap;" ><button class="button button-percorsi" ng-click="closeWin()" style="width:49%">Cancel</button>' +
                '<button class="button button-percorsi" ng-click="detail(' +
                i +
                ')" style="width:49%">Detail</button>' +
                '</div></form>' +
                '</div>',
            icon: {
                type: 'div',
                iconSize: [25, 80],
                html: '<p style="position:absolute;top:5px;left:10px">' + i + ' </p><img src="./img/marker_hole.png" height="41" width="25">',
                popupAnchor: [0, 0]
            }
        });
    }
    $scope.pathMarkers = markers;
    $scope.pathLine = {
        p1: {
            color: 'black',
            weight: 8,
            latlngs: mapConversionService.decode($scope.path.shape),
            //            message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
        }
    };
    $scope.detail = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.path.pois[poiIndex]);
        window.location.assign('#/app/poidetail');
    }

    $scope.closeWin = function () {
        leafletData.getMap().then(function (map) {
            map.closePopup();
        });
    }
    angular.extend($scope, {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        center: {
            lat: 45.890931,
            lng: 11.041126,
            zoom: 12
        },
        markers: $scope.pathMarkers,
        events: {},
        pathLine: $scope.pathLine
    });


    leafletData.getMap().then(function (map) {
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(map);
        map.locate({
            setView: false,
            maxZoom: 8,
            watch: false,
            enableHighAccuracy: true
        });
        map.on('locationfound', onLocationFound);

        function onLocationFound(e) {
            $scope.myloc = e;
            var radius = e.accuracy / 2;

            L.marker(e.latlng).addTo(map);
            //                        .bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).addTo(map);

        }
    });
});
