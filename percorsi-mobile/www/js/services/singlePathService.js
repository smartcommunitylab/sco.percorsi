angular.module('roveretoPercorsi.services.singlePathService', [])

.factory('singlePathService', function ($http, $q, listPathsService) {
    var path = null;
    //var pathId = null;

    var singlePathService = {};
    singlePathService.choosePath = function (pathchoosen) {
        path = pathchoosen;
    }
    singlePathService.getPathChoosed = function () {
        return path;
    }


    return singlePathService;
})
