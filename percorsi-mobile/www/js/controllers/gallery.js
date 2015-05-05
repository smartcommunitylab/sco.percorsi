angular.module('roveretoPercorsi.controllers.gallery', [])

.controller('GalleryCtrl', function ($scope, $http, $ionicModal, galleryService, singlePathService) {
        $scope.item = singlePathService.getSelectedPath();
        $scope.images = [];
        $scope.loadImages = function () {
            $scope.images = galleryService.getGallery();
        }

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
        $ionicModal.fromTemplateUrl('templates/addImages-popup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.images = [];
            $scope.imagesBase64 = [];
            $scope.addimagemodal = modal;
        });
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
    }

);
