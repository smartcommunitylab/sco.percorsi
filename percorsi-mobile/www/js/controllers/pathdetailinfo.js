angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService, $ionicModal, addImageService, $filter, $cordovaCamera, $ionicModal,   addImageService) {
    $scope.item = singlePathService.getSelectedPath();
    singlePoiService.setIndexPoi(null);

    $scope.images =
        $scope.options = [{
            name: $filter('translate')("images_send_percorso_string"),
            id: 0
    }];

    for (var i = 0; i < ($scope.item.pois.length); i++) {
        $scope.options.push({
            name: (i + 1).toString(),
            id: i
        });
    }
    $scope.selectedOption = $scope.options[0];
    $ionicModal.fromTemplateUrl('templates/addImages-popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.images = [];
        $scope.imagesBase64 = [];
        $scope.addimagemodal = modal
    })

    $scope.openAddimage = function () {
        $scope.addimagemodal.show()
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
    $scope.submit = function () {
        addImageService.submit($scope.images, $scope.imagesBase64, $scope.selectedOption);
    };

    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.item.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };
});
