angular.module('roveretoPercorsi.services.singlePathService', [])

.factory('singlePathService', function ($http, $q, listPathsService, Config) {
    var selectedPath = null;
    //var pathId = null;

    var singlePathService = {};

    singlePathService.setSelectedPath = function (path) {
        selectedPath = path;
    }

    singlePathService.getSelectedPath = function () {
        return selectedPath;
    }
    singlePathService.uploadImages = function (idPoi, idPath, images) {
        var deferred = $q.defer();
        item = {};
        if (idPoi != null) {
            return $http({
                method: 'POST',
                url: Config.URL() + '/' + Config.userdata() + '/' + Config.appId() + '/' + idPath + '/' + idPoi + '/images/url?url=' + images[0],
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'

                }
            }).
            success(function (data, status, headers, config) {
                item = data.data;
                deferred.resolve(item);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(data);


            });
        } else {
            return $http({
                method: 'POST',
                url: Config.URL() + '/' + Config.userdata() + '/' + Config.appId() + '/' + idPath + '/images/url?url=' + images[0],
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'

                }
            }).
            success(function (data, status, headers, config) {
                item = data.data;
                deferred.resolve(item);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(data);

            });



        };
        return deferred.promise;
    }
    return singlePathService;
});
