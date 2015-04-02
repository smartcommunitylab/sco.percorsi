angular.module('roveretoPercorsi.services.addImageService', [])

.factory('addImageService', function ($http, $q, Config, singlePathService, $ionicLoading, $ionicHistory, $filter, Toast) {

    var addImageService = {};

    addImageService.submit = function (images, imagesBase64, idPoi, idPath) {
        var remoteURL = [];
        var deferred = $q.defer();
        item = {};

        $ionicLoading.show({
            template: 'Loading...'
        });
        var uploadedimages = 0;
        for (var i = 0; i < images.length; i++) {
            $http({
                method: 'POST',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    Authorization: 'Client-ID b790f7d57013adb',
                    Accept: 'application/json'
                },
                data: {
                    image: imagesBase64[i],
                    type: 'base64'
                }
            }).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                remoteURL.push(data.data.link);
                uploadedimages++
                //send to ws the server
                if (uploadedimages == images.length) {
                    singlePathService.uploadImages(idPoi, idPath, remoteURL).then(function (data) {
                        //chiudi pop up bella la' e esci
                        $ionicLoading.hide();
                        Toast.show($filter('translate')("images_send_toast_ok"), "short", "bottom");
                        //log
                        Restlogging.appLog("AppProsume", "newissue");
                        item = data;
                        deferred.resolve(item);

                    }, function (error) {
                        console.log("problems" + data + status + headers + config);
                        //chiudi pop up ed errore sul server smarcommunity
                        //toast error
                        Toast.show($filter('translate')("images_send_toast_error"), "short", "bottom");
                        $ionicLoading.hide();
                        deferred.reject(error);

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
                deferred.reject(error);

            });
        }

        if (images.length == 0) {
            //if no gallery u are here
            singlePathService.uploadImages(idPoi, idPath, remoteURL).then(function (data) {
                //chiudi pop up bella la' e esci
                $ionicLoading.hide();
                Toast.show($filter('translate')("images_send_toast_ok"), "short", "bottom");
                //log
                Restlogging.appLog("AppProsume", "newissue");
                item = data;
                deferred.resolve(item);


            }, function (error) {
                console.log("problems" + "data:" + data + "status:" + status + "headers:" + headers + "config:" + config);
                //chiudi pop up ed errore sul server smarcommunity
                //toast error
                Toast.show($filter('translate')("images_send_toast_error"), "short", "bottom");
                $ionicLoading.hide();
                deferred.reject(error);


            });
        }
        return deferred.promise;
    };


    return addImageService;
});
