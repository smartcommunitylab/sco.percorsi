angular.module('roveretoPercorsi.controllers.pathdetail', [])

.controller('PathDetailCtrl', function ($scope, singlePathService, favoritesService) {
    var pathId = singlePathService.getSelectedPath().localId;

    $scope.isFavorite = favoritesService.isFavorite(pathId);

    $scope.toggleFavorite = function () {
        if (favoritesService.isFavorite(pathId)) {
            favoritesService.removeFavorite(pathId).then(function (favorites) {
                $scope.isFavorite = false;
            });
        } else {
            favoritesService.addFavorite(pathId).then(function (favorites) {
                $scope.isFavorite = true;
            });
        }
    };
});
