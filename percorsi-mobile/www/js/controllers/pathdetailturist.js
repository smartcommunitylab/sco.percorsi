angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $http, singlePathService, reviewsService) {
    $scope.reviews = {};
    $scope.path = {};

    $scope.path = singlePathService.getPathChoosed();
    //$scope.review = reviewsService.getReviewsList();

    $scope.noMoreReviewsAvailable = false;
    $scope.loadMore = function () {

        var length = 0;
        if ($scope.reviews.data) {
            length = $scope.reviews.data.length;
        }
        reviewsService.getReviewsList(length).then(function (reviews) {
            //check state for array
            $scope.emptylist = false;
            if ($scope.reviews.data) {
                $scope.reviews.data.push.apply($scope.reviews.data, reviews.data);
                if (reviews.data) {
                    if (reviews.data.length < reviewsService.getMaxCounter()) {
                        $scope.noMoreReviewsAvailable = true;
                    }
                }
                /*temp */
                if (reviews.length == 0) {
                    $scope.noMoreReviewsAvailable = true;

                } /*temp */
            } else {
                $scope.reviews = reviews;
            }
            if ($scope.reviews.data.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
});
