angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $http, $ionicPopup, $ionicModal, $filter, $ionicHistory, Toast, singlePathService, reviewsService, DatiDB) {
    $scope.reviews = [];
    $scope.path = singlePathService.getSelectedPath();
    $scope.rating = {
        myreview: '',
        review: '',
        current: 0,
        myvote: 0,
        max: 5
    };

    $scope.syncRating = function () {
        // user rating
        if ($scope.userIsLogged) {
            reviewsService.getUserRate($scope.path.localId).then(function (data) {
                if (!!data) {
                    $scope.rating.review = data.comment;
                    $scope.rating.myreview = data.comment;
                    $scope.rating.current = data.vote;
                    $scope.rating.myvote = data.vote;
                }
            });
        }
    };

    $scope.syncRating();

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
        }

        return stars;
    };

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }

    $scope.noMoreReviewsAvailable = false;

    $scope.loadMore = function (reload) {
        var length = 0;
        if (!reload && $scope.reviews) {
            length = $scope.reviews.length;
        } else if (reload) {
            $scope.reviews = [];
        }

        reviewsService.getRates($scope.path.localId, length).then(function (reviews) {
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
        reviewsService.sendRate($scope.path.localId, vote, $scope.rating.review).then(function (updatedPath) {
            singlePathService.setSelectedPath(updatedPath);
            $scope.path = updatedPath;
            $scope.rating.current = $scope.path.vote;
            Toast.show($filter('translate')('vote_sent_toast_ok'), 'short', 'bottom');
            DatiDB.reset();
        });
    };

    $scope.sendReview = function (review) {
        reviewsService.sendRate($scope.path.localId, $scope.rating.current, review).then(function (updatedPath) {
            singlePathService.setSelectedPath(updatedPath);
            $scope.path = updatedPath;
            $scope.rating.review = $scope.rating.myreview;
            Toast.show($filter('translate')('review_sent_toast_ok'), 'short', 'bottom');
            DatiDB.reset();
            $scope.loadMore(true);
        });
    };

    $scope.showVote = function (name) {
        $scope.rating.myvote = $scope.rating.current;
        if ($scope.userIsLogged) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')('pathdetailturist_voteinfo'),
                templateUrl: 'templates/vote-popup.html',
                scope: $scope,
                buttons: [
                    {
                        text: $filter('translate')('newreview_popup_cancel'),
                        type: ' button-percorsi'
                    },
                    {
                        text: $filter('translate')('newreview_popup_ok'),
                        type: 'button-percorsi',
                        onTap: function (e) {
                            if (!$scope.rating.myvote) {
                                e.preventDefault();
                            } else {
                                //return $scope.rating.current;
                                $scope.sendVote($scope.rating.myvote);
                            }
                        }
                    }
                ]
            });
        } else {
            $scope.loginModal.show();
        }
    };
    $scope.back = function () {
        $ionicHistory.goBack();
    }
    $scope.showReview = function (name) {
        $scope.rating.myreview = $scope.rating.review;
        if ($scope.userIsLogged) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')('newreview_popup_title'),
                templateUrl: 'templates/review-popup.html',
                scope: $scope,
                buttons: [
                    {
                        text: $filter('translate')('newreview_popup_cancel'),
                        type: 'button-percorsi'
                    },
                    {
                        text: $filter('translate')('newreview_popup_ok'),
                        type: 'button-percorsi',
                        onTap: function (e) {
                            if (!$scope.rating.myreview) {
                                e.preventDefault();
                                Toast.show($filter('translate')('review_empty_error'), 'short', 'bottom');

                            } else {
                                // return $scope.review;
                                $scope.sendReview($scope.rating.myreview);
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
