angular.module('roveretoPercorsi.services.singlePathService', [])

.factory('singlePathService', function ($http, $q) {
    var pathId = null;

    var singlePathService = {};
    singlePathService.choosePath = function (id) {
        pathId = id;
    }
    singlePathService.getPathChoosed = function () {
            return pathId;
        }
        //    singlePathService.getPathsByCategoryId = function (categoryId, from) {
        //        var start = null;
        //        var deferred = $q.defer();
        //        /*temp*/
        //        $http.get('data/paths.json').success(function (data) {
        //            paths = data;
        //            from == 0 ? deferred.resolve(paths) : deferred.resolve([]);
        //        }).error(function (data, status, headers, config) {
        //            console.log(data + status + headers + config);
        //            deferred.reject(err);
        //        });
        //        return deferred.promise;
        //        /*temp*/
        //    }


    return singlePathService;
})
