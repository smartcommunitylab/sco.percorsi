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
                deferred.resolve(pathsFromDb);
                from == 0 ? deferred.resolve(pathsFromDb) : deferred.resolve([]);
            },
            function (error) {
                deferred.reject(error);
            });
        /*temp*/
        //        $http.get('data/paths.json').success(function (data) {
        //            paths = data;
        //            from == 0 ? deferred.resolve(paths) : deferred.resolve([]);
        //        }).error(function (data, status, headers, config) {
        //            console.log(data + status + headers + config);
        //            deferred.reject(err);
        //        });

        return deferred.promise;
        /*temp*/
    };

    listPathsService.getFavoritesPaths = function (idsString, from) {
        var start = null;
        var deferred = $q.defer();

        DatiDB.getObjectsById(idsString).then(function (pathsFromDb) {
                deferred.resolve(pathsFromDb);
                from == 0 ? deferred.resolve(pathsFromDb) : deferred.resolve([]);
            },
            function (error) {
                deferred.reject(error);
            }
        );

        //        /*temp*/
        //        $http.get('data/paths.json').success(function (data) {
        //            paths = data;
        //            from == 0 ? deferred.resolve(paths) : deferred.resolve([]);
        //        }).error(function (data, status, headers, config) {
        //            console.log(data + status + headers + config);
        //            deferred.reject(err);
        //        });
        /*temp*/

        return deferred.promise;
    };

    return listPathsService;
});
