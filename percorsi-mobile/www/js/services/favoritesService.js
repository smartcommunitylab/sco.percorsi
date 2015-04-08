angular.module('roveretoPercorsi.services.favoritesService', [])

.factory('favoritesService', function ($q) {
    var favoritesService = {};

    // mirror with window.localStorage['favorites']
    var favoritesMap = {};

    if (!!window.localStorage.favorites) {
        // read
        favoritesMap = JSON.parse(window.localStorage.favorites);
    } else {
        // init
        window.localStorage.favorites = JSON.stringify(favoritesMap);
    }

    favoritesService.getFavorites = function () {
        return favoritesMap;
    };

    favoritesService.getFavoritesString = function () {
        var ids = Object.keys(favoritesMap);

        var idsString = '';
        for (var i = 0; i < ids.length; i++) {
            if (i > 0) {
                idsString += ',';
            }
            idsString += ids[i];
        }

        return idsString;
    };

    favoritesService.isFavorite = function (pathId) {
        return !!favoritesMap[pathId];
    };

    favoritesService.addFavorite = function (pathId) {
        var deferred = $q.defer();

        if (!favoritesService.isFavorite(pathId)) {
            favoritesMap[pathId] = true;
            window.localStorage.favorites = JSON.stringify(favoritesMap);
            deferred.resolve(favoritesMap);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    favoritesService.removeFavorite = function (pathId) {
        var deferred = $q.defer();

        if (favoritesService.isFavorite(pathId)) {
            delete favoritesMap[pathId];
            window.localStorage.favorites = JSON.stringify(favoritesMap);
            deferred.resolve(favorites);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    return favoritesService;
});
