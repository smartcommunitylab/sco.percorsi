angular.module('roveretoPercorsi.controllers.poidetail', [])

.controller('PoiDetailCtrl', function ($scope, $http, singlePoiService, singlePathService, $ionicSlideBoxDelegate, $ionicPopup, $filter, $state, $cordovaCamera, $ionicModal, $ionicLoading, Toast) {
    $scope.path = singlePathService.getSelectedPath();
    //    $scope.poi = singlePoiService.getSelectedPoi();
    $scope.item = singlePoiService.getSelectedPoi();

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


    $scope.addImagePopup = function (name) {
        $scope.images = [];
        $scope.imagesBase64 = [];

        var confirmPopup = $ionicPopup.confirm({
            title: $filter('translate')("addImage_label"),
            //            template: '<input type="text" ng-model="review.text">',
            templateUrl: 'templates/addImages-popup.html',
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')("addImage_popup_cancel"),
                    type: 'button-percorsi'
                            },
                {
                    text: $filter('translate')("addImage_popup_ok"),
                    type: ' button-percorsi',
                    onTap: function (e) {
                        if (!$scope.images) {
                            e.preventDefault();
                        } else {
                            $scope.submit();
                        }
                    }
                }
                                ]
        });

    }
    $scope.removeImage = function (imageName) {
        var index = $scope.images.indexOf(imageName);
        if (index > -1) {
            $scope.images.splice(index, 1);
        }

    }
    $ionicModal.fromTemplateUrl('templates/gallerymodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        var currentIndex = $ionicSlideBoxDelegate.$getByHandle('detail-slide-box').currentIndex();
        $scope.modal.show().then(function () {
            $ionicSlideBoxDelegate.$getByHandle('gallerymodal-slide-box').slide(currentIndex, 0);
        });
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.submit = function () {
        var remoteURL = [];

        $ionicLoading.show({
            template: 'Loading...'
        });
        var uploadedimages = 0;
        for (var i = 0; i < $scope.images.length; i++) {
            $http({
                method: 'POST',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    Authorization: 'Client-ID b790f7d57013adb',
                    Accept: 'application/json'
                },
                data: {
                    image: $scope.imagesBase64[i],
                    type: 'base64'

                }
            }).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                remoteURL.push(data.data.link);
                uploadedimages++
                //send to ws the server
                if (uploadedimages == $scope.images.length) {
                    singlePoiService.uploadImages(remoteURL).then(function (data) {
                        //chiudi pop up bella la' e esci
                        $ionicLoading.hide();
                        console.log("upload images success. Now send data to server...." + segnalaService.getPosition());
                        //torna indietro con toast successo

                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        Toast.show($filter('translate')("images_send_toast_ok"), "short", "bottom");
                        //log
                        Restlogging.appLog("AppProsume", "newissue");
                    }, function (error) {
                        console.log("problems" + data + status + headers + config);
                        //chiudi pop up ed errore sul server smarcommunity
                        //toast error
                        Toast.show($filter('translate')("images_send_toast_error"), "short", "bottom");
                        $ionicLoading.hide();

                    });
                }
            }).
            error(function (data, status, headers, config) {
                $ionicLoading.hide();
                console.log("problems" + "data:" + JSON.stringify(data, null, 4) + "status:" + status + "headers:" + headers + "config:" + config);
                //chiudi pop up ed errore sul server immagini
                //toast error
                Toast.show($filter('translate')("images_send_toast_error"), "short", "bottom");
                $ionicLoading.hide();

            });
        }
        if ($scope.images.length == 0) {
            //if no gallery u are here
            singlePoiService.uploadImages(remoteURL).then(function (data) {
                //chiudi pop up bella la' e esci
                $ionicLoading.hide();
                console.log("upload images success. Now send data to server...." + segnalaService.getPosition());
                //torna indietro con toast successo
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                Toast.show($filter('translate')("images_send_toast_ok"), "short", "bottom");
                //log
                Restlogging.appLog("AppProsume", "newissue");

            }, function (error) {
                console.log("problems" + "data:" + data + "status:" + status + "headers:" + headers + "config:" + config);
                //chiudi pop up ed errore sul server smarcommunity
                //toast error
                Toast.show($filter('translate')("images_send_toast_error"), "short", "bottom");
                $ionicLoading.hide();

            });
        }
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
    }

});
