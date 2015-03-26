angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $http, $ionicPopup, $filter, singlePathService, reviewsService) {
    $scope.reviews = {};
    $scope.path = {};

    $scope.path = singlePathService.getSelectedPath();
    $scope.rating = 0;
    $scope.ratings = [{
        current: 3,
        max: 5
    }];

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }


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
    $scope.showVote = function (name) {
        var confirmPopup = $ionicPopup.confirm({
            title: $filter('translate')("pathdetailturist_voteinfo"),
            //            template: '<div><span ng-repeat="rating in ratings"><div star-rating rating-value="rating.current" max="rating.max" on-rating-selected="getSelectedRating(rating)"></div></span></div>',
            templateUrl: 'templates/vote-popup.html',
            scope: $scope,
            buttons: [
                {

                    text: $filter('translate')("newreview_popup_cancel"),
                    type: ' button-percorsi'
                            },
                {
                    text: $filter('translate')("newreview_popup_ok"),
                    type: 'button-percorsi',
                    onTap: function (e) {
                        if (!$scope.ratings[0].current) {
                            e.preventDefault();
                        } else {
                            return $scope.ratings[0].current;
                        }
                    }
                    }
            ]
        });

    }
    $scope.showReview = function (name) {
        $scope.review = {
            text: ""
        };

        var confirmPopup = $ionicPopup.confirm({
            title: $filter('translate')("newreview_popup_title"),
            //            template: '<input type="text" ng-model="review.text">',
            templateUrl: 'templates/review-popup.html',
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')("newreview_popup_cancel"),
                    type: 'button-percorsi'
                            },
                {
                    text: $filter('translate')("newreview_popup_ok"),
                    type: ' button-percorsi',
                    onTap: function (e) {
                        if (!$scope.review) {
                            e.preventDefault();
                        } else {
                            return $scope.review;
                        }
                    }
                }
                                ]
        });

    }



});
