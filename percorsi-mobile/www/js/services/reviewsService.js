angular.module('roveretoPercorsi.services.reviews', [])

.factory('reviewsService', function ($http, $q, Config) {
    var reviews = null;
    var counter = '10';

    var reviewsService = {};

    reviewsService.getMaxCounter = function () {
        return counter;
    };

    reviewsService.getRates = function (pathId, start) {
        var start = null;
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: Config.URL() + '/' + Config.app() + '/paths/' + Config.appId() + '/' + pathId + '/' + 'rate',
            params: {
                'start': start,
                'count': counter
            }
        }).
        success(function (data) {
            reviews = data;
            if (start == 0) {
                deferred.resolve(reviews);
            } else {
                deferred.resolve([]);
            };
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    reviewsService.sendRate = function (pathId, vote, comment) {
        return $http({
            method: 'POST',
            url: Config.URL() + '/' + Config.app() + '/' + Config.userdata + '/' + Config.appId() + '/' + pathId + '/' + 'rate',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                'vote': vote,
                'comment': comment
            }
        }).
        success(function (data, status, headers, config) {
            /*TODO*/
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
        });
    };

    return reviewsService;
});
