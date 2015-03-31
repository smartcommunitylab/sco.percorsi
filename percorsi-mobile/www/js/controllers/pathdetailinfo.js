angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService) {
    $scope.item = singlePathService.getSelectedPath();
    singlePoiService.setIndexPoi(null);

    $scope.badabum = function () {
        window.alert('FAB!');
    };

    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.item.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };
});
