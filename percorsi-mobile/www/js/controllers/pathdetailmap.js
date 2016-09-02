angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, $state, singlePathService, $ionicPlatform, $ionicHistory, mapService, leafletData, $filter, mapConversionService, singlePoiService) {
    $scope.path = singlePathService.getSelectedPath();
    var markers = [];
    var boundArray = [];
    var mymap = document.getElementById('map-container');
    mapService.initMap('tabMap').then(function () {
        //add polyline
    });
    if (mymap != null) {
        resizeElementHeight(mymap);
    }
    window.onresize = function () {
        if (mymap != null) {
            resizeElementHeight(mymap);
        }
    }

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
                '<h4 class="text-pop-up">' + (i + 1) + '. ' + $filter('translate_remote')($scope.path.pois[i].title) + '</h4>' +
                '<div class="row">' +
                '<div class="col"><button class="button button-percorsi button-balloon button-block" ng-click="detail(' + i + ')">' + '<i class="icon ion-information-circled"></i>' + '</button></div>' +
                '<div class="col"><button class="button button-percorsi button-balloon button-block" ng-click="bringmethere([' + $scope.path.pois[i].coordinates.lat + ', ' + $scope.path.pois[i].coordinates.lng + '])">' + '<i class="icon ion-android-navigate"></i>' + '</button></div>' +
                '</div>' +
                '</div>',
            icon: {
                type: 'div',
                iconSize: [32, 32],
                html: '<p class="number-map">' + (i + 1) + ' </p><img src="./img/marker_hole.png">',
                popupAnchor: [0, 0]
            }
        });
    };

    $scope.pathMarkers = markers;
    $scope.pathLine = {
        p1: {
            color: '#009688',
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
        mapService.getMap('tabMap').then(function (map) {
            map.closePopup();
        });
    };

    if (singlePoiService.getIndexPoi() == null) {
        angular.extend($scope, {
            tileLayer: "http://{s}.tile.openstreetmap.org/cycle/{z}/{x}/{y}.png",
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
            tileLayer: "http://{s}.tile.openstreetmap.org/cycle/{z}/{x}/{y}.png",
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

    mapService.getMap('tabMap').then(function (map) {
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
            L.circle(e.latlng, radius).addTo(map);
        };

    });




    function resizeElementHeight(element) {
        var height = 0;
        var body = window.document.body;
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if (body.parentElement.clientHeight) {
            height = body.parentElement.clientHeight;
        } else if (body && body.clientHeight) {
            height = body.clientHeight;
        }
        console.log('height' + height);
        element.style.height = ((height - element.offsetTop) + "px");
    }
});