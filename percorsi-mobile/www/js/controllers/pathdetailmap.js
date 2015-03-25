angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, singlePathService, $ionicPlatform, leafletData, mapConversionService) {
    $scope.path = singlePathService.getSelectedPath();
    var markers = [];
    for (i = 0; i < $scope.path.pois.length; i++) {
        markers.push({
            lat: $scope.path.pois[i].coordinates.lat,
            lng: $scope.path.pois[i].coordinates.long,

            //            message: '<div ng-controller="MapCtrl">' +
            //                '<div><label><strong> <i>' + $scope.mySignals.data[i].attribute.title + '</i></strong></label></div>' +
            //                '<div><label><i class="icon ion-location" style="font-size:25px;"></i> ' + $scope.mySignals.data[i].location.address + '</i></label></div>' +
            //                '<div align="center" style="white-space:nowrap;" ><button class="button button-custom" ng-click="closeWin()" style="width:49%">Cancel</button>' +
            //                '<button class="button button-custom" ng-click="detail(\'#/app/archiviodetail/' + $scope.mySignals.data[i].id + '\')" style="width:49%">Detail</button>' +
            //                '</div></form>' +
            //                '</div>',
            //
            //            icon: {
            //                iconUrl: $scope.getIcon($scope.mySignals.data[i]),
            //                iconSize: [50, 50]
            //            },
            //                        focus: true
        });
    }
    $scope.pathMarkers = markers;


    angular.extend($scope, {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        center: {
            lat: 45.890931,
            lng: 11.041126,
            zoom: 12
        },
        markers: $scope.pathMarkers,
        events: {},
        pathLine: {
            p1: {
                color: 'red',
                weight: 8,
                latlngs: [
                    {
                        lat: 51.50,
                        lng: -0.082
                },
                    {
                        lat: 48.83,
                        lng: 2.37
                },
                    {
                        lat: 41.91,
                        lng: 12.48
                }
                        ],
                message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
            },
            p2: {
                color: 'green',
                weight: 8,
                latlngs: [
                    {
                        lat: 48.2083537,
                        lng: 16.3725042
                },
                    {
                        lat: 48.8534,
                        lng: 2.3485
                }
                        ],
                label: {
                    message: "<h3>Route from Vienna to Paris</h3><p>Distance: 1211km</p>"
                }
            }
        }
    });
    window.alert(mapConversionService.decode(""));
});
