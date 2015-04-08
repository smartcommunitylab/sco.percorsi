angular.module('roveretoPercorsi.controllers.favorites', [])

.controller('FavoritesCtrl', function ($scope, $http, listPathsService, favoritesService, DatiDB) {
    $scope.paths = [];
    $scope.noMorePathsAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.paths.data) {
            length = $scope.paths.data.length;
        }

        listPathsService.getFavoritesPaths(favoritesService.getFavoritesString(), length).then(function (paths) {
            $scope.emptylist = false;
            if ($scope.paths) {
                $scope.paths.push.apply($scope.paths, paths);
                if (paths) {
                    if (paths.length < listPathsService.getMaxCounter()) {
                        $scope.noMorePathsAvailable = true;
                    }
                }

                if (paths.length == 0) {
                    $scope.noMorePathsAvailable = true;
                }
            } else {
                $scope.paths = paths;
            }

            if ($scope.paths.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
});
