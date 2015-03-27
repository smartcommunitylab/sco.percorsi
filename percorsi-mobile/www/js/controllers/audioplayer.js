angular.module('roveretoPercorsi.controllers.audioplayer', [])

.controller('AudioPlayerCtrl', function ($scope, $http, singlePathService) {
    $scope.audios = [];

    $scope.setAudios = function (audios) {
        $scope.audios = audios;
    };

    $scope.audioTrack = 0;

    if (!!$scope.audios && $scope.audios.length > 0) {
        $scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
    }
    $scope.audioIsPlaying = false;

    var audioPlay = function () {
        if (!!!$scope.audio) {
            $scope.audio = new Audio($scope.audios[$scope.audioTrack]);
        }
        $scope.audio.play();
        $scope.audioIsPlaying = true;
    };

    var audioPause = function () {
        $scope.audio.pause();
        $scope.audioIsPlaying = false;
    };

    var audioSkip = function (forward) {
        if (forward) {
            $scope.audioTrack == $scope.audios.length - 1 ? ($scope.audioTrack = 0) : $scope.audioTrack++;
        } else {
            $scope.audioTrack == 0 ? ($scope.audioTrack = $scope.audios.length - 1) : $scope.audioTrack--;
        }

        if ($scope.audioIsPlaying) {
            audioPause();
            $scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
            audioPlay();
        } else {
            $scope.audio = new Audio($scope.audios[$scope.audioTrack].url);
        }
    };

    $scope.audioToggle = function () {
        $scope.audioIsPlaying ? audioPause() : audioPlay();
    };

    $scope.audioPrev = function () {
        audioSkip(false);
    }

    $scope.audioNext = function () {
        audioSkip(true);
    }
});
