angular.module('roveretoPercorsi.controllers.poidetail', [])

.controller('PoiDetailCtrl', function ($scope, $http, singlePoiService, singlePathService, $ionicSlideBoxDelegate, $ionicPopup, $filter, $state) {
    $scope.path = singlePathService.getSelectedPath();


    $scope.poi = singlePoiService.getSelectedPoi();


    var endOfThePath = function () {
        if (singlePoiService.getIndexPoi() == $scope.path.pois.length - 1) {
            return true;
        } else {
            return false;

        }
    }
    var beginOfThePath = function () {
        if (singlePoiService.getIndexPoi() == 0) {
            return true;
        } else {
            return false;

        }
    }
    $scope.lastPOI = endOfThePath();
    $scope.firstPOI = beginOfThePath();

    $scope.goToMap = function () {
        $state.go('app.pathdetail.map');

    }
    $scope.nextPOI = function () {
        singlePoiService.setIndexPoi(singlePoiService.getIndexPoi() + 1);
        singlePoiService.setSelectedPoi($scope.path.pois[singlePoiService.getIndexPoi()]);
        //check last poi
        $scope.lastPOI = endOfThePath();

        $state.go($state.current, {}, {
            reload: true
        });
    };
    $scope.prevPOI = function () {
        singlePoiService.setIndexPoi(singlePoiService.getIndexPoi() - 1);
        singlePoiService.setSelectedPoi($scope.path.pois[singlePoiService.getIndexPoi()]);
        //check first poi
        $scope.firstPOI = beginOfThePath();

        $state.go($state.current, {}, {
            reload: true
        });
    };



});
