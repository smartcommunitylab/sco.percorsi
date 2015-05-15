angular.module('roveretoPercorsi.controllers.gallery', [])

.controller('GalleryCtrl', function ($scope, $http, $ionicModal, galleryService, singlePathService, singlePoiService, $cordovaCamera, $filter, Toast, addImageService, DatiDB) {
        $scope.item = null;
        $scope.path = singlePathService.getSelectedPath();
        if (galleryService.galleryof == "path") {
            $scope.item = $scope.path;
        } else {
            $scope.item = singlePoiService.getSelectedPoi();
        }
        $scope.emptylist = true;
        //$scope.images = [];
        $scope.loadImages = function () {
            $scope.images = galleryService.getGallery();
            if ($scope.images.length > 0) {
                $scope.emptylist = false;
            }

        }
        $scope.images = $scope.options = [{
            name: $filter('translate')('images_send_percorso_string'),
            id: 0
    }];

        for (var i = 0; i < ($scope.path.pois.length); i++) {
            $scope.options.push({
                name: $filter('translate_remote')($scope.path.pois[i].title),
                id: (i + 1)
            });
        }


        $scope.getURLSource = function (item) {
            if (item.type == "video") {
                return $scope.youtubeEmbed(item.url);
            }
            return item.url;
        }

        $scope.isAVideo = function (item) {
            if (item.type == "video") {
                return true;
            }
            return false;
        }

        $scope.getImageAction = function (index) {
            if ($scope.images[index].type == "video") {
                //action video
                window.open($scope.images[index].url, '_system');
            }
            if (galleryService.galleryof == "path") {
                $scope.openModal('path-details-slide-box', index);
                $scope.selectedOption = $scope.options[0];

            } else {
                $scope.openModal('poi-details-slide-box', index);
                $scope.selectedOption = $scope.options[singlePoiService.getIndexPoi() + 1];

            }
        }

        $scope.openAddimage = function () {
            if ($scope.userIsLogged) {
                $scope.addimagemodal.show()
                $scope.image = [];
                $scope.imageBase64 = [];
                $scope.selectedOption = $scope.options[0];
            } else {
                $scope.loginModal.show();
            }
        };
        $ionicModal.fromTemplateUrl('templates/addImages-popup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imageBase64 = [];
            $scope.addimagemodal = modal;
        });
        $scope.closeAddimage = function () {
            $scope.addimagemodal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.addimagemodal.remove();
            //$scope.loginModal.remove();
        });

        $scope.removeImage = function (index) {
            //var index = $scope.images.indexOf(imageName);
            //if (index > -1) {
            $scope.image.splice(index, 1);
            $scope.imageBase64.splice(index, 1);
            //}
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
                $scope.image.push(image);
                $scope.imageBase64.push(imageData);
            }, function (err) {
                console.log(err);
            });
        };

        $scope.changeItem = function (item) {
            $scope.selectedOption = item;
        };

        $scope.submit = function () {
            //set $scope.idPoiChoosen
            //if no image return
            if ($scope.image.length > 0) {
                if ($scope.selectedOption.id != undefined || $scope.selectedOption == 0) {
                    $scope.idPoiChoosen = null;
                } else {
                    $scope.idPoiChoosen = $scope.path.pois[$scope.selectedOption - 1].localId;
                }

                addImageService.submit($scope.image, $scope.imageBase64, $scope.idPoiChoosen, $scope.path.localId).then(function (newpath) {
                    $scope.addimagemodal.hide();
                    //update data
                    //$scope.item = newpath.data.data;
                    //set new gallery
                    //                    var gallery = [];
                    //                    if (galleryService.galleryof == "path") {
                    //                        $scope.item = newpath.data.data;
                    //                    } else {
                    //                        $scope.item = newpath.data.data.pois[singlePoiService.getIndexPoi()];
                    //                    }
                    //                    if ($scope.item.images) {
                    //
                    //                        for (var i = 0; i < $scope.item.images.length; i++) {
                    //                            gallery.push({
                    //                                url: $scope.item.images[i].url,
                    //                                type: "image"
                    //                            });
                    //                        }
                    //                    }
                    //                    if ($scope.item.videos) {
                    //
                    //                        for (var i = 0; i < $scope.item.videos.length; i++) {
                    //                            gallery.push({
                    //                                url: $scope.item.videos[i].url,
                    //                                type: "video"
                    //                            });
                    //                        }
                    //                    }
                    if (galleryService.galleryof == "path") {
                        $scope.item = newpath.data.data;
                    } else {
                        $scope.item = newpath.data.data.pois[singlePoiService.getIndexPoi()];
                    }
                    var gallery = galleryService.createGallery($scope.item);
                    $scope.images = gallery;
                    galleryService.setGallery(gallery);
                    singlePathService.setSelectedPath(newpath.data.data);

                    if (galleryService.galleryof == "poi") {
                        singlePoiService.setSelectedPoi(newpath.data.data.pois[singlePoiService.getIndexPoi()]);
                    }
                    DatiDB.reset();
                });
            } else {
                Toast.show($filter('translate')('addImage_isEmpty'), 'short', 'bottom');

            }
        }

    }

);
