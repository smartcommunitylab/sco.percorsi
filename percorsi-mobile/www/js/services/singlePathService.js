angular.module('roveretoPercorsi.services.singlePathService', [])

.factory('singlePathService', function ($http, $q, listPathsService, Config) {
    var selectedPath = null;
    var radius = 10000;
    //    var maxPostsNumber = 500;
    var facebooksources = 200;
    //var pathId = null;

    var singlePathService = {};

    singlePathService.setSelectedPath = function (path) {
        selectedPath = path;
    }

    singlePathService.getSelectedPath = function () {
        return selectedPath;
    }

    singlePathService.getPlacesAround = function (lat, long, categories) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: ' https://iescities.com/IESCities/api/social/places?coordinates=' + lat + ',' + long + '&facebookSources=' + facebooksources + '&radius=' + radius + '&categories=' + categories,
            timeout: 5000
        }).
        success(function (data) {
            var placesaround = data;
            if (data.length != 0) {
                deferred.resolve(placesaround);
            } else {
                deferred.resolve([]);
            };
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject();
        });

        return deferred.promise;

    }
    return singlePathService;
});
