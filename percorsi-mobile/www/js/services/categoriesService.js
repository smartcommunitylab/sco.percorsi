angular.module('roveretoPercorsi.services.categories', [])

.factory('categoriesService', function ($http, $q, DatiDB) {
    var categories = null;
    var counter = '10';

    var selectedCategory = null;

    var categoriesService = {};
    categoriesService.getMaxCounter = function () {
        return counter;
    }

    categoriesService.getCategoriesList = function (from) {
        var start = null;
        var deferred = $q.defer();
        DatiDB.getCategories().then(function (categories) {
                deferred.resolve(categories);
                from == 0 ? deferred.resolve(categories) : deferred.resolve([]);
            },
            function (error) {
                deferred.reject(error);
            });
        /*temp*/
        //        $http.get('data/categories.json').success(function (data) {
        //            categories = data;
        //            if (from == 0)
        //                deferred.resolve(categories);
        //            else deferred.resolve([]);
        //        }).error(function (data, status, headers, config) {
        //            console.log(data + status + headers + config);
        //            deferred.reject(err);
        //        });
        return deferred.promise;
        /*temp*/
    }

    categoriesService.setSelectedCategory = function (category) {
        selectedCategory = category;
    }

    categoriesService.getSelectedCategory = function () {
        return selectedCategory;
    }

    return categoriesService;
})
