angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService) {
    $scope.path = singlePathService.getSelectedPath();

    $scope.badabum = function () {
        window.alert('FAB!');
    }

    $scope.audioTrack = 0;
    if (!!$scope.path) {
        $scope.audio = new Audio($scope.path.audios[$scope.audioTrack].url);
    }
    $scope.audioIsPlaying = false;

    var audioPlay = function () {
        if (!!!$scope.audio) {
            $scope.audio = new Audio($scope.path.audios[$scope.audioTrack]);
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
            $scope.audioTrack == $scope.path.audios.length - 1 ? ($scope.audioTrack = 0) : $scope.audioTrack++;
        } else {
            $scope.audioTrack == 0 ? ($scope.audioTrack = $scope.path.audios.length - 1) : $scope.audioTrack--;
        }

        if ($scope.audioIsPlaying) {
            audioPause();
            $scope.audio = new Audio($scope.path.audios[$scope.audioTrack].url);
            audioPlay();
        } else {
            $scope.audio = new Audio($scope.path.audios[$scope.audioTrack].url);
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
