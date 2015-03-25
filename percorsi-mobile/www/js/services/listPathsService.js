angular.module('roveretoPercorsi.services.listPathsService', [])

.factory('listPathsService', function ($http, $q) {
    var paths = null;
    var counter = '10';

    var listPathsService = {};
    listPathsService.getMaxCounter = function () {
        return counter;
    }

    listPathsService.getPathsByCategoryId = function (categoryId, from) {
        var start = null;
        var deferred = $q.defer();
        /*temp*/
        $http.get('data/paths.json').success(function (data) {
            paths = data;
            from == 0 ? deferred.resolve(paths) : deferred.resolve([]);
        }).error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(err);
        });
        return deferred.promise;
        /*temp*/
    }


    return listPathsService;
})