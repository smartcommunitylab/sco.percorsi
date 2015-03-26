angular.module('roveretoPercorsi.controllers.poidetail', [])

.controller('PoiDetailCtrl', function ($scope, $http, singlePoiService) {
    $scope.poi = singlePoiService.getSelectedPoi();

});
