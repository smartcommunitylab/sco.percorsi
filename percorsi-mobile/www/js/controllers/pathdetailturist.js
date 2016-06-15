angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $rootScope, $http, $ionicPopup, $ionicModal, $filter, $ionicHistory, Toast, singlePathService, galleryService, reviewsService, DatiDB) {
    $scope.reviews = [];
    $scope.path = singlePathService.getSelectedPath();
    $scope.rating = {
        myreview: '',
        review: '',
        current: 0,
        myvote: 0,
        max: 5
    };

    $scope.back = function () {
        if ($ionicHistory.length > 0) {
            $ionicHistory.goBack();
        } else {
            $state.go('app.pathdetail.info');
            // window.location.assign("#/app/path/info");
        }
    }

    var getStars = function (vote) {
        var stars = [];

        if (!!$scope.path) {
            var fullStars = Math.floor(vote);
            for (var i = 0; i < fullStars; i++) {
                stars.push('full');
            }

            var halfStars = Math.ceil((vote % 1).toFixed(4));
            for (var i = 0; i < halfStars; i++) {
                stars.push('half');
            }

            var emptyStars = Math.floor(($scope.rating.max) - vote);
            for (var i = 0; i < emptyStars; i++) {
                stars.push('empty');
            }
        }

        return stars;
    };
    $scope.mystars = getStars(0);

    $scope.myRating = function () {
        return getStars($scope.rating.myvote);
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
                    $scope.mystars = getStars(data.vote);
                }
            });
        }
    };

    $scope.syncRating();

    $scope.getStars = function () {
        if ($scope.path.vote)
            return getStars($scope.path.vote);
        return 0;
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

            if (!!$scope.reviews && $scope.reviews.length == 0 || $scope.reviews && $scope.reviews.length == 1 && $scope.getUserId() == $scope.reviews[0].contributor.userId) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.sendVote = function (vote, review) {
        reviewsService.sendRate($scope.path.localId, vote, review).then(function (updatedPath) {
            singlePathService.setSelectedPath(updatedPath);
            $scope.path = updatedPath;
            $scope.rating.current = vote;
            $scope.rating.review = review;
            $scope.mystars = getStars(vote);
            Toast.show($filter('translate')('vote_sent_toast_ok'), 'short', 'bottom');
            DatiDB.reset();
        });
    };

    //    $scope.sendReview = function (review) {
    //        reviewsService.sendRate($scope.path.localId, $scope.rating.current, review).then(function (updatedPath) {
    //            singlePathService.setSelectedPath(updatedPath);
    //            $scope.path = updatedPath;
    //            $scope.rating.review = $scope.rating.myreview;
    //            Toast.show($filter('translate')('review_sent_toast_ok'), 'short', 'bottom');
    //            DatiDB.reset();
    //            $scope.loadMore(true);
    //        });
    //    };
    //    $scope.openGallery = function () {
    //        var gallery = [];
    //        for (var i = 0; i < $scope.path.images.length; i++) {
    //            if ($scope.path.images[i].userDefined) {
    //                gallery.push($scope.path.images[i].url);
    //            }
    //        }
    //
    //        galleryService.setGallery(gallery);
    //        window.location.assign("#/app/gallery");
    //
    //
    //    }

    $ionicModal.fromTemplateUrl('templates/review-modal.html', {
        scope: $scope,
        focusFirstInput: true,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reviewModal = modal;
    });

    $scope.reviewClose = function () {
        $scope.reviewModal.hide();
    }
    $scope.reviewOk = function () {
        if (!$scope.rating.myvote) {
            e.preventDefault();
        } else {
            $scope.sendVote($scope.rating.myvote, $scope.rating.myreview);
            $scope.reviewModal.hide();
        }
    }
    $scope.showVote = function (name) {
        $scope.rating.myvote = $scope.rating.current;
        if ($scope.userIsLogged) { //$scope.userIsLogged
            $scope.reviewModal.show();
            //            var confirmPopup = $ionicPopup.confirm({
            //                title: $filter('translate')('pathdetailturist_voteinfo'),
            //                templateUrl: 'templates/vote-popup.html',
            //                scope: $scope,
            //                buttons: [
            //                    {
            //                        text: $filter('translate')('newreview_popup_cancel'),
            //                        type: ' button-percorsi'
            //                    },
            //                    {
            //                        text: $filter('translate')('newreview_popup_ok'),
            //                        type: 'button-percorsi',
            //                        onTap: function (e) {
            //                            if (!$scope.rating.myvote) {
            //                                e.preventDefault();
            //                            } else {
            //                                //return $scope.rating.current;
            //                                $scope.sendVote($scope.rating.myvote);
            //                            }
            //                        }
            //                    }
            //                ]
            //            });
        } else {
            $scope.loginModal.show();
        }
    };
    $scope.back = function () {
            $ionicHistory.goBack();
        }
        //    $scope.showReview = function (name) {
        //        $scope.rating.myreview = $scope.rating.review;
        //        if ($scope.userIsLogged) {
        //            var confirmPopup = $ionicPopup.confirm({
        //                title: $filter('translate')('newreview_popup_title'),
        //                templateUrl: 'templates/review-popup.html',
        //                scope: $scope,
        //                buttons: [
        //                    {
        //                        text: $filter('translate')('newreview_popup_cancel'),
        //                        type: 'button-percorsi'
        //                    },
        //                    {
        //                        text: $filter('translate')('newreview_popup_ok'),
        //                        type: 'button-percorsi',
        //                        onTap: function (e) {
        //                            if (!$scope.rating.myreview) {
        //                                e.preventDefault();
        //                                Toast.show($filter('translate')('review_empty_error'), 'short', 'bottom');
        //
        //                            } else {
        //                                // return $scope.review;
        //                                $scope.sendReview($scope.rating.myreview);
        //                            }
        //                        }
        //                    }
        //                ]
        //            });
        //        } else {
        //            $scope.loginModal.show();
        //        }
        //    }
});
