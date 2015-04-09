angular.module('roveretoPercorsi.services.reviews', [])

.factory('reviewsService', function ($http, $q, Config) {
    var counter = '10';

    var reviewsService = {};

    reviewsService.getMaxCounter = function () {
        return counter;
    };

    reviewsService.getRates = function (pathId, length) {
        var start = length;
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
            var reviews = data.data;
            if (start == 0) {
                deferred.resolve(reviews);
            } else {
                deferred.resolve([]);
            };
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    reviewsService.getUserRate = function (pathId) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: Config.URL() + '/' + Config.app() + '/' + Config.userdata() + '/' + Config.appId() + '/' + pathId + '/' + 'rate',
            headers: {
                'Accept': 'application/json'
            }
        }).
        success(function (data, status, headers, config) {
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    reviewsService.sendRate = function (pathId, vote, comment) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: Config.URL() + '/' + Config.app() + '/' + Config.userdata() + '/' + Config.appId() + '/' + pathId + '/' + 'rate',
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
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    return reviewsService;
});
