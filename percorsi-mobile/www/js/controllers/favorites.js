angular.module('roveretoPercorsi.controllers.favorites', [])

.controller('FavoritesCtrl', function ($scope, $http, $ionicHistory, $window, $ionicSideMenuDelegate, categoriesService, listPathsService, singlePathService, favoritesService, DatiDB) {
    $scope.paths = [];
    $scope.noMorePathsAvailable = false;
    categoriesService.setSelectedCategory(null);

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.paths) {
            length = $scope.paths.length;
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
        }, function (error) {
            // 'not found!' aka empty list
            $scope.noMorePathsAvailable = true;
            $scope.emptylist = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.back = function () {
        window.location.assign('#/app/favorites/');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    }
    $scope.isFavorite = function (pathId) {
        return favoritesService.isFavorite(pathId);
    };

    $scope.setSelectedPath = function (path) {
        singlePathService.setSelectedPath(path);
    }
});
