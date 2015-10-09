angular.module('roveretoPercorsi.controllers.audioplayer', [])

.controller('AudioPlayerCtrl', function ($scope, $rootScope, $http, $cordovaMedia, $ionicLoading, $filter) {
    $scope.audios = [];
    $scope.audio = null;
    $scope.audioTrack = 0;
    $scope.audioIsPlaying = false;
    //    $scope.audioIsFirst = false;
    //    $scope.audioIsEnd = false;


    $scope.setAudios = function (audios) {
        $scope.audios = audios;
        if ($rootScope.audio) {
            audioPause();
        }
        if (!!$scope.audios && $scope.audios.length > 0) {
            //$scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
            $scope.audio = new Media($scope.audios[$scope.audioTrack].url, null, null, mediaStatusCallback);
            $rootScope.audio = $scope.audio;
        }
    };

    $scope.$watch('item', function () {
        $scope.setAudios($scope.item.audios);
    });
    //     $scope.play = function(src) {
    //        var media = new Media(src, null, null, mediaStatusCallback);
    //        $cordovaMedia.play(media);
    //    }
    //
    var mediaStatusCallback = function (status) {
        if (status == 1) {
            $ionicLoading.show({
                template: $filter('translate')('audio_starting')
            });
        } else {
            $ionicLoading.hide();
        }
    }

    var audioPlay = function () {
        if (!!!$scope.audio) {
            // $scope.audio = new Audio($scope.audios[$scope.audioTrack]);
            $scope.audio = new Media($scope.audios[$scope.audioTrack].url, null, null, mediaStatusCallback);

        }
        $scope.audio.play();
        $scope.audioIsPlaying = true;
    };

    var audioPause = function () {
        if ($scope.audio) {
            $scope.audio.pause();
            $scope.audioIsPlaying = false;
        }
    };

    var audioSkip = function (forward) {
        if (forward) {
            $scope.audioTrack == $scope.audios.length - 1 ? ($scope.audioTrack = 0) : $scope.audioTrack++;
        } else {
            $scope.audioTrack == 0 ? ($scope.audioTrack = $scope.audios.length - 1) : $scope.audioTrack--;
        }

        if ($scope.audioIsPlaying) {
            audioPause();
            //$scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
            $scope.audio = new Media($scope.audios[$scope.audioTrack].url, null, null, mediaStatusCallback);
            audioPlay();
        } else {
            //$scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
            $scope.audio = new Media($scope.audios[$scope.audioTrack].url, null, null, mediaStatusCallback);
        }
    };

    $scope.$on('$locationChangeStart', function () {
        if ($rootScope.audio) {
            $rootScope.audio.pause();
        }
    });

    $scope.audioToggle = function () {
        $scope.audioIsPlaying ? audioPause() : audioPlay();
    };

    $scope.audioPrev = function () {
        if (audioTrack != 0) {
            audioSkip(false);
        }
    }

    $scope.audioNext = function () {
        if (audioTrack == (item.audios.length - 1)) {
            audioSkip(true);
        }
    }

});
