angular.module('roveretoPercorsi.services.listPathsService', [])

.factory('listPathsService', function ($http, $q, $filter, GeoLocate, DatiDB) {
    var paths = null;
    var counter = '10';

    var listPathsService = {};
    listPathsService.getMaxCounter = function () {
        return counter;
    }

    //    listPathsService.getPathsByCategoryId = function (category, from) {
    //        var start = null;
    //        var deferred = $q.defer();
    //
    //        DatiDB.getPathsByCategoryId(category.id).then(function (pathsFromDb) {
    //                from == 0 ? deferred.resolve(pathsFromDb) : deferred.resolve([]);
    //            },
    //            function (error) {
    //                deferred.reject(error);
    //            });
    //
    //
    //        return deferred.promise;
    //    };

    function alpha(a, b) {
        if ($filter('translate_remote')(a.title) < $filter('translate_remote')(b.title))
            return -1;
        if ($filter('translate_remote')(a.title) > $filter('translate_remote')(b.title))
            return 1;
        return 0;
    };

    function distance(a, b) {
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    };

    function length(a, b) {
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    };

    function time(a, b) {
        if (a.time < b.time)
            return -1;
        if (a.time > b.time)
            return 1;
        return 0;
    };

    function difficulty(a, b) {
        if (a.difficulty < b.difficulty)
            return -1;
        if (a.difficulty > b.difficulty)
            return 1;
        return 0;
    }

    function distancefromme(a, b) {
        if (a.distancefromme < b.distancefromme)
            return -1;
        if (a.distancefromme > b.distancefromme)
            return 1;
        return 0;
    }

    //    function distance(a, b, myposition) {
    //        var poi1 = [a.pois[0].coordinates.lat, a.pois[0].coordinates.lng];
    //        var poi2 = [b.pois[0].coordinates.lat, b.pois[0].coordinates.lng];
    //        if (GeoLocate.distance(myposition, poi1) < GeoLocate.distance(myposition, poi2))
    //            return -1;
    //        if (GeoLocate.distance(myposition, poi1) > GeoLocate.distance(myposition, poi2))
    //            return 1;
    //        return 0;
    //
    //
    //    }
    var orderBy = function (order, listPath, myposition) {
        switch (order) {
        case "alpha":
            return listPath.sort(alpha);
        case "length":
            return listPath.sort(length);
        case "time":
            return listPath.sort(time);
        case "length":
            return listPath.sort(length);
        case "difficulty":
            return listPath.sort(difficulty);
        case "distance":
            //            return listPath.sort(function (a, b) {
            //                return distance(a, b, myposition)
            //            });
            return listPath.sort(distancefromme);

        default:
            return listPath.sort(alpha);
        }

    };

    var addDistanceFromMyposition = function (myposition, paths) {
        for (var k = 0; k < paths.length; k++) {
            var startingpoint = [paths[k].pois[0].coordinates.lat, paths[k].pois[0].coordinates.lng];
            var distancefromme = GeoLocate.distance(myposition, startingpoint);
            paths[k].distancefromme = distancefromme;
        }

    }
    listPathsService.getPathsByCategoryIdAndOrder = function (category, order, from) {
        var start = null;
        var deferred = $q.defer();

        DatiDB.getPathsByCategoryId(category.id, order).then(function (pathsFromDb) {
                GeoLocate.locate().then(function (myposition) {
                        //add filed distance from me to all paths
                        addDistanceFromMyposition(myposition, pathsFromDb);
                        from == 0 ? deferred.resolve(orderBy(order, pathsFromDb, myposition)) : deferred.resolve([]);
                    },
                    function (error) {
                        //resolve without new field but hide distance and option in sorting menu
                        from == 0 ? deferred.resolve(orderBy(order, pathsFromDb)) : deferred.resolve([]);

                        //deferred.reject(error);
                    });
            },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };


    listPathsService.getFavoritesPaths = function (idsString, from) {
        var start = null;
        var deferred = $q.defer();
        if (idsString == "") {
            deferred.resolve([]);
        }
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
