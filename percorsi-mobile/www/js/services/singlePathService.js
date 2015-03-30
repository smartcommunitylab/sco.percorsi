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
    singlePathService.uploadImages = function (images) {

        //      //use index of path for right POI
        //      //use poi.index for right POI
        return $http({
            method: 'POST',
            url: Config.URL() + '/' + Config.provider() + '/services/' + Config.service() + '/user/images',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            },
            data: images
        }).
        success(function (data, status, headers, config) {

        }).
        error(function (data, status, headers, config) {


        });



    };
    return singlePathService;
});
