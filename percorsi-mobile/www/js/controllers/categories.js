angular.module('roveretoPercorsi.controllers.categories', [])

.controller('CategoriesCtrl', function ($scope, $rootScope, $http, categoriesService, DatiDB, Config) {
    $scope.categories = [];
    $scope.noMoreCategoriesAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.categories) {
            length = $scope.categories.length;
        }

        categoriesService.getCategoriesList(length).then(function (categories) {
            //check state for array
            $scope.emptylist = false;
            if ($scope.categories) {
                $scope.categories.push.apply($scope.categories, categories.categories);
                if (categories.categories) {
                    if (categories.categories.length < categoriesService.getMaxCounter()) {
                        $scope.noMoreCategoriesAvailable = true;
                    }
                }
                if (categories.categories.length == 0) {
                    $scope.noMoreCategoriesAvailable = true;
                }
            } else {
                $scope.categories = categories;
                $rootScope.categories = categories;
            }

            if ($scope.categories.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    $scope.setSelectedCategory = function (category) {
        categoriesService.setSelectedCategory(category);
    }



    DatiDB.sync().then(function (data) {

    });

})
