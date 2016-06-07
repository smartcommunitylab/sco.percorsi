angular.module('roveretoPercorsi.services.mapService', [])

.factory('mapService', function ($q, $http, $ionicPlatform, $filter, $timeout, Config, leafletData, GeoLocate) {

    var cachedMap = {};


    var mapService = {};
    var myLocation = {};



    mapService.getMap = function (mapId) {
        var deferred = $q.defer();

        if (cachedMap[mapId] == null) {
            mapService.initMap(mapId).then(function () {
                deferred.resolve(cachedMap[mapId]);
            });
        } else {
            deferred.resolve(cachedMap[mapId]);
        }

        return deferred.promise;
    }

    mapService.setMyLocation = function (myNewLocation) {
        myLocation = myNewLocation
    };
    mapService.getMyLocation = function () {
        return myLocation;
    };

    //init map with tile server provider and show my position
    mapService.initMap = function (mapId) {
        var deferred = $q.defer();

        leafletData.getMap(mapId).then(function (map) {
                cachedMap[mapId] = map;
                L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
                    type: 'map',
                    ext: 'jpg',
                    attribution: '',
                    subdomains: '1234',
                    maxZoom: 18
                }).addTo(map);
                $ionicPlatform.ready(function () {
                    GeoLocate.locate().then(function (e) {
                        L.marker(L.latLng(e[0], e[1])).addTo(map);
                    });
                });

                deferred.resolve(map);
            },
            function (error) {
                console.log('error creation');
                deferred.reject(error);
            });
        return deferred.promise;
    }
    mapService.centerOnMe = function (mapId, zoom) {
        leafletData.getMap(mapId).then(function (map) {
            GeoLocate.locate().then(function (e) {
                $timeout(function () {
                    map.setView(L.latLng(e[0], e[1]), zoom);
                });
            });
        });

    };



    mapService.resizeElementHeight = function (element, mapId) {
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
        element.style.height = (((height - element.offsetTop) / 2) + "px");
        this.getMap(mapId).then(function (map) {
            map.invalidateSize();
        })
    }
    mapService.refresh = function (mapId) {
        this.getMap(mapId).then(function (map) {
            map.invalidateSize();
        })
    }

    return mapService;
})
