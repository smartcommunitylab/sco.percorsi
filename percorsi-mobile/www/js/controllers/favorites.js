angular.module('roveretoPercorsi.controllers.favorites', [])

.controller('FavoritesCtrl', function ($scope, $http, $ionicHistory, $window, $ionicSideMenuDelegate, $filter, $stateParams, categoriesService, listPathsService, singlePathService, favoritesService, DatiDB) {
    $scope.favorites = true;
    $scope.paths = [];
    $scope.noMorePathsAvailable = false;
    categoriesService.setSelectedCategory(null);
    var length = 0;


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
    listPathsService.getFavoritesPaths(favoritesService.getFavoritesString(), length).then(function (paths) {
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
        listPathsService.getFavoritesPaths(favoritesService.getFavoritesString(), length).then(function (paths) {
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
    $scope.hideOption = function (optiontohide) {
            if (optiontohide == $scope.data.actualOrder) {
                return false;
            }
            if ($scope.data.actualOrder == 'alpha' && ((optiontohide == 'time') || (optiontohide == 'difficulty'))) {
                return false;
            }
            return true;

        }
        //    $scope.loadMore = function () {
        //        var length = 0;
        //
        //        if ($scope.paths) {
        //            length = $scope.paths.length;
        //        }
        //
        //        listPathsService.getFavoritesPaths(favoritesService.getFavoritesString(), length).then(function (paths) {
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
        //        }, function (error) {
        //            // 'not found!' aka empty list
        //            $scope.noMorePathsAvailable = true;
        //            $scope.emptylist = true;
        //            $scope.$broadcast('scroll.infiniteScrollComplete');
        //        });
        //    };

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
