angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, $ionicSlideBoxDelegate, $ionicModal, singlePathService, singlePoiService) {
    $scope.path = singlePathService.getSelectedPath();
    singlePoiService.setIndexPoi(null);
    $scope.badabum = function () {
        window.alert('FAB!');
    };

    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.path.pois[poiIndex]);
        window.location.assign('#/app/poidetail');
    };

    $ionicModal.fromTemplateUrl('templates/gallerymodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        var currentIndex = $ionicSlideBoxDelegate.$getByHandle('pathdetail-info-slide-box').currentIndex();
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
