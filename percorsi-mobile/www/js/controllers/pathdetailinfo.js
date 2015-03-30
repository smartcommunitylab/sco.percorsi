angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService) {
    $scope.path = singlePathService.getSelectedPath();
    singlePoiService.setIndexPoi(null);
    $scope.badabum = function () {
        window.alert('FAB!');
    };

    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.path.pois[poiIndex]);
        window.location.assign('#/app/poidetail');
    };
});
