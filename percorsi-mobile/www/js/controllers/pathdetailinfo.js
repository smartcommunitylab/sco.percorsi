angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService) {
    window.alert(singlePathService.getPathChoosed());
})
