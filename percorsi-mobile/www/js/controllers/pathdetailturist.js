angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $http, $ionicPopup, $ionicModal, $filter, Toast, singlePathService, reviewsService) {
    /*    $ionicModal.fromTemplateUrl('templates/login-popup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.loginModal = modal;
        });

        $scope.loginClose = function () {
            $scope.loginModal.hide();
        };

        $scope.loginOpen = function () {
            $rootScope.login().then(function () {
                Toast.show($filter('translate')('login_done'), 'short', 'bottom');
                $scope.loginModal.hide();
            });
        };*/

    $scope.reviews = [];
    $scope.path = singlePathService.getSelectedPath();

    $scope.rating = {
        current: 0,
        max: 5
    };

    $scope.getStars = function () {
        var stars = [];

        if (!!$scope.path && !!$scope.path.vote) {
            var fullStars = Math.floor($scope.path.vote);
            for (var i = 0; i < fullStars; i++) {
                stars.push('full');
            }

            var halfStars = Math.ceil(($scope.path.vote % 1).toFixed(4));
            for (var i = 0; i < halfStars; i++) {
                stars.push('half');
            }

            var emptyStars = Math.floor(($scope.rating.max) - $scope.path.vote);
            for (var i = 0; i < emptyStars; i++) {
                stars.push('empty');
            }
        } else {
            $scope.loginModal.show();
        }

        return stars;
    };

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }

    $scope.noMoreReviewsAvailable = false;
    $scope.loadMore = function () {
        var length = 0;
        if ($scope.reviews) {
            length = $scope.reviews.length;
        }

        reviewsService.getRates(length).then(function (reviews) {
            //check state for array
            $scope.emptylist = false;
            if ($scope.reviews) {
                $scope.reviews.push.apply($scope.reviews, reviews);
                if (reviews && reviews.length < reviewsService.getMaxCounter()) {
                    $scope.noMoreReviewsAvailable = true;
                }
            } else {
                $scope.reviews = reviews;
            }

            if (!!$scope.reviews && $scope.reviews.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.sendVote = function (vote) {
        reviewsService.sendRate($scope.path.localId, vote, null).then(function (updatedPath) {
            $scope.path = updatedPath;
            Toast.show($filter('translate')("vote_sent_toast_ok"), "short", "bottom")
        });
    };

    $scope.sendReview = function (review) {
        reviewsService.sendRate($scope.path.localId, null, review).then(function (updatedPath) {
            $scope.path = updatedPath;
            Toast.show($filter('translate')("review_sent_toast_ok"), "short", "bottom");
        });
    };

    $scope.showVote = function (name) {
        if ($scope.userIsLogged) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')("pathdetailturist_voteinfo"),
                //template: '<div><span ng-repeat="rating in ratings"><div star-rating rating-value="rating.current" max="rating.max" on-rating-selected="getSelectedRating(rating)"></div></span></div>',
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
                            if (!$scope.rating.current) {
                                e.preventDefault();
                            } else {
                                //return $scope.rating.current;
                                $scope.sendVote($scope.rating.current);
                            }
                        }
                    }
                ]
            });
        } else {
            $scope.loginModal.show();
        }
    };

    $scope.showReview = function (name) {
        $scope.review = {
            text: ""
        };

        if ($scope.userIsLogged) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')("newreview_popup_title"),
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
                                // return $scope.review;
                                $scope.sendReview($scope.review.text);
                            }
                        }
                    }
                ]
            });
        } else {
            $scope.loginModal.show();
        }
    }
});
