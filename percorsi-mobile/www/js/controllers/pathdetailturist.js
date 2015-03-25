angular.module('roveretoPercorsi.controllers.pathdetailturist', [])

.controller('PathDetailTuristCtrl', function ($scope, $http, singlePathService) {
    window.alert(singlePathService.getPathChoosed());
})
