angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService, $ionicModal, addImageService, $filter, $cordovaCamera, Toast, $ionicModal, $rootScope, $ionicSlideBoxDelegate, $ionicHistory, $rootScope, categoriesService, DatiDB, addImageService) {
    $scope.item = singlePathService.getSelectedPath();
    $scope.idPoiChoosen = null;
    $scope.expandedList = false;
    $scope.expandedText = false;

    $scope.group = {

    };

    //    $scope.item.cost = "iksiad";
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
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
            $scope.expandedList = false;

        } else {
            $scope.shownGroup = group;
            $scope.expandedList = true;

        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
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
    $ionicModal.fromTemplateUrl('templates/addImages-popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.images = [];
        $scope.imagesBase64 = [];
        $scope.addimagemodal = modal;
    });

    $scope.openAddimage = function () {
        if ($scope.userIsLogged) {
            $scope.addimagemodal.show()
            $scope.images = [];
            $scope.imagesBase64 = [];
            $scope.selectedOption = $scope.options[0];
        } else {
            $scope.loginModal.show();
        }
    };

    $scope.closeAddimage = function () {
        $scope.addimagemodal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.addimagemodal.remove();
        //$scope.loginModal.remove();
    });

    $scope.removeImage = function (imageName) {
        var index = $scope.images.indexOf(imageName);
        if (index > -1) {
            $scope.images.splice(index, 1);
            $scope.imagesBase64.splice(index, 1);
        }
    };
    $scope.back = function () {
        window.location.assign("#/app/path");
    }

    $scope.addImage = function (wherePic) {
        var options = {};

        // 2
        if (wherePic == 'Camera') {
            options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
        } else {
            options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
        }

        // 3
        $cordovaCamera.getPicture(options).then(function (imageData) {
            //I have to add to file array imageData and visualize
            // 4
            image = "data:image/jpeg;base64," + imageData;
            $scope.images.push(image);
            $scope.imagesBase64.push(imageData);
        }, function (err) {
            console.log(err);
        });
    };

    $scope.changeItem = function (item) {
        $scope.selectedOption = item;
    };

    $scope.submit = function () {
        //set $scope.idPoiChoosen
        if ($scope.selectedOption.id != undefined || $scope.selectedOption == 0) {
            $scope.idPoiChoosen = null;
        } else {
            $scope.idPoiChoosen = $scope.item.pois[$scope.selectedOption - 1].localId;
        }

        addImageService.submit($scope.images, $scope.imagesBase64, $scope.idPoiChoosen, $scope.item.localId).then(function (newpath) {
            $scope.addimagemodal.hide();
            //update data
            $scope.item = newpath.data.data;
            singlePathService.setSelectedPath($scope.item);
            $ionicSlideBoxDelegate.$getByHandle('path-details-slide-box').update();
            DatiDB.reset();
        });
    };

    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.item.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };

});
