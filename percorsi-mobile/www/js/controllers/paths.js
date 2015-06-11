angular.module('roveretoPercorsi.controllers.paths', [])

.controller('PathsCtrl', function ($scope, $http, $stateParams, $ionicHistory, categoriesService, listPathsService, singlePathService, favoritesService) {
    $scope.category = categoriesService.getSelectedCategory();
    $scope.paths = [];
    $scope.noMorePathsAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.paths) {
            length = $scope.paths.length;
        }

        listPathsService.getPathsByCategoryId($stateParams, length).then(function (paths) {
            //check state for array come funziona
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

    $scope.back = function () {
        window.location.assign('#/app/categories');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    }
    $scope.setSelectedPath = function (path) {
        singlePathService.setSelectedPath(path);
    }

    $scope.isFavorite = function (pathId) {
        return favoritesService.isFavorite(pathId);
    };
});
