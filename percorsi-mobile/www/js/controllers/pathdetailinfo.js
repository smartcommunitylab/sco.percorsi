angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService, $ionicModal, addImageService, $filter, $cordovaCamera, Toast, $ionicModal, $rootScope, $ionicSlideBoxDelegate, $ionicHistory, $rootScope, categoriesService, DatiDB, addImageService, galleryService) {
    $scope.item = singlePathService.getSelectedPath();
    $scope.idPoiChoosen = null;
    $scope.expandedList = false;
    $scope.expandedDescritpion = false;
    $scope.group = {

    };

    $scope.item.cost = "iksiad";
    $scope.item.parking = "iksiad";
    $scope.item.transport = "iksiad";
    $scope.item.accessibility = "iksiad";
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.noExtraListValues = function () {
        if ($scope.item.cost == null && $scope.item.parking == null && $scope.item.transport == null && $scope.item.accessibility == null) {
            return true
        }
        return false;
    }
    $scope.hideExpandListButton = function () {
        if (!$scope.expandedList) {
            return false;
        }
        return true;
    }

    $scope.hideCloseListButton = function () {
        if ($scope.expandedList) {
            return false;
        }
        return true;
    }
    $scope.toggleGroupList = function (group) {
        if ($scope.isGroupListShown(group)) {
            $scope.expandedList = false;
            $scope.shownGroup = null;

        } else {
            $scope.shownGroup = group;
            $scope.expandedList = true;

        }
    };
    $scope.isGroupListShown = function (group) {
        return $scope.shownGroup === group;
    };


    $scope.toggleDescription = function () {
        if ($scope.isDescriptionShown()) {
            $scope.expandedDescritpion = false;
        } else {
            $scope.expandedDescritpion = true;

        }
    };
    $scope.isDescriptionShown = function () {
        return $scope.expandedDescritpion;
    };
    $scope.hideExpandDescriptionButton = function () {
        if (!$scope.isDescriptionShown()) {
            return false;
        }
        return true;
    };
    $scope.hideCloseDescriptionButton = function () {
        if ($scope.isDescriptionShown()) {
            return false;
        }
        return true;
    };
    singlePoiService.setIndexPoi(null);

    $scope.images = $scope.options = [{
        name: $filter('translate')('images_send_percorso_string'),
        id: 0
    }];

    for (var i = 0; i < ($scope.item.pois.length); i++) {
        $scope.options.push({
            name: $filter('translate_remote')($scope.item.pois[i].title),
            id: (i + 1)
        });
    }

    $scope.selectedOption = $scope.options[0];


    $scope.openGallery = function () {
        window.location.assign("#/app/gallery");
        galleryService.setGallery($scope.item.images);

    }

    $scope.back = function () {
        window.location.assign("#/app/path");
    }



    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.item.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };

});
