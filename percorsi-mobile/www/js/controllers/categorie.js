angular.module('roveretoPercorsi.controllers.categorie', [])

.controller('CategorieCtrl', function ($scope, $http, categoriesService) {
    $scope.categories = {};
    $scope.noMoreCategoriesAvailable = false;
    $scope.loadMore = function () {

        var length = 0;
        if ($scope.categories.data) {
            length = $scope.categories.data.length;
        }
        categoriesService.getCategoriesList(length).then(function (categories) {
            //check state for array
            $scope.emptylist = false;
            if ($scope.categories.data) {
                $scope.categories.data.push.apply($scope.categories.data, categories.data);
                if (categories.data) {
                    if (categories.data.length < categoriesService.getMaxCounter()) {
                        $scope.noMoreCategoriesAvailable = true;
                    }
                }
                /*temp */
                if (categories.length == 0) {
                    $scope.noMoreCategoriesAvailable = true;

                } /*temp */
            } else {
                $scope.categories = categories;
            }
            if ($scope.categories.data.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
})