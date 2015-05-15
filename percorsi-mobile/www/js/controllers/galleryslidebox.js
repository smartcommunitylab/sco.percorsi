angular.module('roveretoPercorsi.controllers.galleryslidebox', [])

.controller('GallerySlideBoxCtrl', function ($scope, $http, $ionicSlideBoxDelegate, $ionicModal, galleryService) {
    $ionicModal.fromTemplateUrl('templates/gallerymodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.getImageAction = function (index) {
        if ($scope.images[index].type == "video") {
            //action video
            window.open($scope.images[index].url, '_system');
        }
        if (galleryService.galleryof == "path") {
            $scope.openModal('path-details-slide-box', index);
        } else {
            $scope.openModal('poi-details-slide-box', index);
        }
    }
    $scope.openModal = function (handleName, index) {
        var currentIndex = 0;
        if (index == -1) {
            currentIndex = $ionicSlideBoxDelegate.$getByHandle(handleName).currentIndex();
        } else {
            currentIndex = index;
        }
        $scope.modal.show().then(function () {
            $ionicSlideBoxDelegate.$getByHandle('gallerymodal-slide-box').slide(currentIndex, 0);
        });
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
});
