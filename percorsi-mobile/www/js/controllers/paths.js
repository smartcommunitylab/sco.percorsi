angular.module('roveretoPercorsi.controllers.paths', [])

.controller('PathsCtrl', function ($scope, $http, $stateParams, listPathsService, singlePathService) {
    $scope.paths = {};
    $scope.noMorePathsAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.paths.data) {
            length = $scope.paths.data.length;
        }

        listPathsService.getPathsByCategoryId($stateParams, length).then(function (paths) {
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

    $scope.choosePath = function (path) {
        singlePathService.choosePath(path);
    }

    $scope.m2km = function (m) {
        return Math.round((m / 1000) * 10) / 10;
    }

    $scope.min2time = function (min) {
        return Math.floor(min / 60) + ':' + min % 60;
    }
});
