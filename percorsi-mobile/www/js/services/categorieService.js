angular.module('roveretoPercorsi.services.categories', [])

.factory('categoriesService', function ($http, $q) {
    var categories = null;
    var counter = '10';

    var categoriesService = {};
    categoriesService.getMaxCounter = function () {
        return counter;
    }

    categoriesService.getCategoriesList = function (from) {
        var start = null;
        var deferred = $q.defer();
        /*temp*/
        $http.get('data/categorie.json').success(function (data) {
            categories = data;
            if (from == 0)
                deferred.resolve(categories);
            else deferred.resolve([]);
        }).error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(err);
        });
        return deferred.promise;
        /*temp*/
    }

    return categoriesService;
})
