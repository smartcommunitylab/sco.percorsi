angular.module('roveretoPercorsi.services.listPathsService', [])

.factory('listPathsService', function ($http, $q, DatiDB) {
    var paths = null;
    var counter = '10';

    var listPathsService = {};
    listPathsService.getMaxCounter = function () {
        return counter;
    }

    listPathsService.getPathsByCategoryId = function (category, from) {
        var start = null;
        var deferred = $q.defer();

        DatiDB.getPathsByCategoryId(category.id).then(function (pathsFromDb) {
                from == 0 ? deferred.resolve(pathsFromDb) : deferred.resolve([]);
            },
            function (error) {
                deferred.reject(error);
            });


        return deferred.promise;
    };

    listPathsService.getFavoritesPaths = function (idsString, from) {
        var start = null;
        var deferred = $q.defer();


        DatiDB.getObjectsById(idsString).then(function (pathsFromDb) {
                from == 0 ? deferred.resolve(pathsFromDb) : deferred.resolve([]);
            },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    return listPathsService;
});
