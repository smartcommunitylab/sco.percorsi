angular.module('roveretoPercorsi.controllers.pathdetailmap', [])

.controller('PathDetailMapCtrl', function ($scope, $http, singlePathService) {
    window.alert(singlePathService.getPathChoosed());

})
