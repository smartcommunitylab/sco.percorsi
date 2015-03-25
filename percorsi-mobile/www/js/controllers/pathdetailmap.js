angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, singlePathService, $ionicPlatform, leafletData, mapConversionService) {
    $scope.path = singlePathService.getPathChoosed();
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
    $scope.pathParkers = markers;


    angular.extend($scope, {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        center: {
            lat: 45.890931,
            lng: 11.041126,
            zoom: 12
        },
        markers: $scope.pathParkers,
        events: {}
    });
    window.alert(mapConversionService.decode(""));
});
