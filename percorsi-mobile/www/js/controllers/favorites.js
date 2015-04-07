angular.module('roveretoPercorsi.controllers.favorites', [])

.controller('FavoritesCtrl', function ($scope, $http, listPathsService, singlePathService) {
    $scope.paths = {};
    $scope.noMorePathsAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.paths.data) {
            length = $scope.paths.data.length;
        }

        listPathsService.getFavoritesPaths(length).then(function (paths) {
            //check state for array come funziona
            $scope.emptylist = false;
            if ($scope.paths.data) {
                $scope.paths.data.push.apply($scope.paths.data, paths.data);
                if (paths.data) {
                    if (paths.data.length < pathsService.getMaxCounter()) {
                        $scope.noMorePathsAvailable = true;
                    }
                }

                /* temp */
                if (paths.length == 0) {
                    $scope.noMorePathsAvailable = true;
                } /* temp */
            } else {
                $scope.paths = paths;
            }

            if ($scope.paths.data.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    $scope.setSelectedPath = function (path) {
        singlePathService.setSelectedPath(path);
    }
});
