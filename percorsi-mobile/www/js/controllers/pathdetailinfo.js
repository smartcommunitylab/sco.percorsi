angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService) {
    $scope.path = singlePathService.getSelectedPath();
});
