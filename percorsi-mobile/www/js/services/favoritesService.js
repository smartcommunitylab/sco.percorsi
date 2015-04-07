angular.module('roveretoPercorsi.services.favoritesService', [])

.factory('favoritesService', function ($q) {
    var favoritesService = {};

    if (!window.localStorage['favorites']) {
        window.localStorage['favorites'] = JSON.stringify([]);
    }

    favoritesService.getFavorites = function () {
        return JSON.parse(window.localStorage['favorites']);
    };

    favoritesService.isFavorite = function (pathId) {
        return favoritesService.getFavorites().indexOf(pathId) > -1;
    };

    favoritesService.addFavorite = function (pathId) {
        var deferred = $q.defer();

        if (!favoritesService.isFavorite(pathId)) {
            var favorites = favoritesService.getFavorites();
            favorites.push(pathId);
            window.localStorage['favorites'] = JSON.stringify(favorites);
            deferred.resolve(favorites);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    favoritesService.removeFavorite = function (pathId) {
        var deferred = $q.defer();

        if (favoritesService.isFavorite(pathId)) {
            var favorites = favoritesService.getFavorites();
            var index = favorites.indexOf(pathId);
            favorites.splice(index, 1);
            window.localStorage['favorites'] = JSON.stringify(favorites);
            deferred.resolve(favorites);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    return favoritesService;
});
