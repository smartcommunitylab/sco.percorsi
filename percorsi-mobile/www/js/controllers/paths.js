angular.module('roveretoPercorsi.controllers.paths', [])

.controller('PathsCtrl', function ($scope, $rootScope, $http, $ionicPopup, $stateParams, $ionicHistory, $filter, $ionicLoading, categoriesService, listPathsService, singlePathService, favoritesService) {
    $scope.category = categoriesService.getSelectedCategory();
    $rootScope.extLogging("AppConsume", "category+" + $scope.category.id);
    $scope.paths = [];
    $scope.noMorePathsAvailable = false;
    $scope.orderList = [
        {
            text: $filter('translate')('orderby_alphabetically'),
            value: "alpha"
        },
        {
            text: $filter('translate')('orderby_length'),
            value: "length"
        },
        {
            text: $filter('translate')('orderby_time'),
            value: "time"
        },
        {
            text: $filter('translate')('orderby_difficulty'),
            value: "difficulty"
        },
        {
            text: $filter('translate')('orderby_distance'),
            value: "distance"
        }
  ];
    $scope.data = {
        actualOrder: 'alpha'
    }
    listPathsService.getPathsByCategoryIdAndOrder($stateParams, $scope.data.actualOrder, length).then(function (paths) {
        $scope.emptylist = false;
        $scope.paths = paths;

        if ($scope.paths.length == 0) {
            $scope.emptylist = true;
        } else {
            $scope.emptylist = false;
        }
    });



    $scope.order = function (newOrderBy) {
        $scope.data.actualOrder = newOrderBy;
    }
    var orderList = function (orderBy) {
        $ionicLoading.show();
        listPathsService.getPathsByCategoryIdAndOrder($stateParams, $scope.data.actualOrder, length).then(function (paths) {
            $scope.emptylist = false;
            $scope.paths = paths;

            if ($scope.paths.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }
            $ionicLoading.hide();
        }, function () {
            $ionicLoading.hide();
        });
    }



    $scope.showOrder = function () {
        var orderPopup = $ionicPopup.confirm({
            cssClass: 'order-popup',
            templateUrl: 'templates/order-popover.html',
            scope: $scope,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'Cancel',

                }, {
                text: 'OK',
                onTap: function (e) {
                    return $scope.data.actualOrder;
                }
  }]
        });
        orderPopup.then(function (res) {
            if (res) {
                orderList(res);
            }
        });
    };



    //    $scope.loadMore = function () {
    //        var length = 0;
    //
    //        if ($scope.paths) {
    //            length = $scope.paths.length;
    //        }
    //
    //        listPathsService.getPathsByCategoryId($stateParams, length).then(function (paths) {
    //            //check state for array come funziona
    //            $scope.emptylist = false;
    //            if ($scope.paths) {
    //                $scope.paths.push.apply($scope.paths, paths);
    //                if (paths) {
    //                    if (paths.length < listPathsService.getMaxCounter()) {
    //                        $scope.noMorePathsAvailable = true;
    //                    }
    //                }
    //
    //                if (paths.length == 0) {
    //                    $scope.noMorePathsAvailable = true;
    //                }
    //            } else {
    //                $scope.paths = paths;
    //            }
    //
    //            if ($scope.paths.length == 0) {
    //                $scope.emptylist = true;
    //            } else {
    //                $scope.emptylist = false;
    //            }
    //
    //            $scope.$broadcast('scroll.infiniteScrollComplete');
    //        });
    //    }
    $scope.checkStringLength = function (string) {
        if (($filter('translate_remote')(string)).length > 50) {
            return true;
        } else {
            return false;
        }

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
