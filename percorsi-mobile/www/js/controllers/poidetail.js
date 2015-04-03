angular.module('roveretoPercorsi.controllers.poidetail', [])

.controller('PoiDetailCtrl', function ($scope, $http, singlePoiService, singlePathService, $ionicSlideBoxDelegate, $ionicPopup, $filter, $state, $cordovaCamera, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, Toast, addImageService) {
    $scope.path = singlePathService.getSelectedPath();
    $scope.item = singlePoiService.getSelectedPoi();
    $scope.idPoiChoosen = null;

    $scope.currentItemIndex = singlePoiService.getIndexPoi() + 1;

    $scope.images =
        // $scope.poiChoosed = singlePoiService.getIndexPoi() + 1;
        $scope.options = [{
            name: $filter('translate')("images_send_percorso_string"),
            id: 0
    }];

    for (var i = 0; i < ($scope.path.pois.length); i++) {
        $scope.options.push({
            name: (i + 1).toString(),
            id: i
        });
    }
    $scope.selectedOption = $scope.options[singlePoiService.getIndexPoi() + 1];

    var endOfThePath = function () {
        if (!!$scope.path && (singlePoiService.getIndexPoi() == $scope.path.pois.length - 1)) {
            return true;
        } else {
            return false;
        }
    };

    var beginOfThePath = function () {
        if (singlePoiService.getIndexPoi() == 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.lastPOI = endOfThePath();
    $scope.firstPOI = beginOfThePath();

    $scope.goToMap = function () {
        $state.go('app.pathdetail.map');
    };

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


    $ionicModal.fromTemplateUrl('templates/addImages-popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.images = [];
        $scope.imagesBase64 = [];
        $scope.addimagemodal = modal;
        $scope.selectedOption = $scope.options[singlePoiService.getIndexPoi() + 1];
    })

    $scope.openAddimage = function () {
        $scope.addimagemodal.show()
        $scope.images = [];
        $scope.imagesBase64 = [];
        $scope.selectedOption = $scope.options[singlePoiService.getIndexPoi() + 1];
    }

    $scope.closeAddimage = function () {
        $scope.addimagemodal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.addimagemodal.remove();
    });

    $scope.removeImage = function (imageName) {
        var index = $scope.images.indexOf(imageName);
        if (index > -1) {
            $scope.images.splice(index, 1);
            $scope.imagesBase64.splice(index, 1);
        }
    };
    $scope.changeItem = function (item) {
        $scope.selectedOption = item;

    }
    $scope.submit = function () {
        if ($scope.selectedOption.id != 0 || $scope.selectedOption == 0) {
            $scope.idPoiChoosen = null;
        } else {
            $scope.idPoiChoosen = $scope.path.pois[$scope.selectedOption.id].localId;
        }

        addImageService.submit($scope.images, $scope.imagesBase64, $scope.idPoiChoosen, $scope.path.localId).then(function (newpath) {
            $scope.addimagemodal.hide();
            //update data (it is a path), I want the right poi
            $scope.item = newpath.data.data.pois[singlePoiService.getIndexPoi()];
            //$ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.$getByHandle('details-slide-box').update();
        });

        //
        //        if ($scope.selectedOption.id != 0) {
        //            $scope.idPoiChoosen = $scope.path.pois[$scope.selectedOption.id].localId;
        //        }
        //        if (addImageService.submit($scope.images, $scope.imagesBase64, $scope.idPoiChoosen, $scope.path.localId)) {
        //            $scope.addimagemodal.hide();
        //            $scope.item = newpath.data.data;
        //            $ionicSlideBoxDelegate.update();
        //        }
    };

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
    }
});
