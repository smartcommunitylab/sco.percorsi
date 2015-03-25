angular.module('roveretoPercorsi.services.singlePathService', [])

.factory('singlePathService', function ($http, $q, listPathsService) {
    var selectedPath = null;
    //var pathId = null;

    var singlePathService = {};

    singlePathService.setSelectedPath = function (path) {
        selectedPath = path;
    }

    singlePathService.getSelectedPath = function () {
        return selectedPath;
    }

    return singlePathService;
});
