angular.module('roveretoPercorsi.controllers.pathdetail', [])

.controller('PathDetailCtrl', function ($scope, singlePathService, favoritesService, FilterVariable) {
    if (singlePathService.getSelectedPath() != null) {
        var pathId = singlePathService.getSelectedPath().localId;
        Restlogging.appLog("AppConsume", "path+" + pathId);
        $scope.isFavorite = favoritesService.isFavorite(pathId);
    }
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
    $scope.isSocialTabVisible = function () {
        return FilterVariable.getFilterSocialTab();
    }
});
