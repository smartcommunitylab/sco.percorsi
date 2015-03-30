angular.module('roveretoPercorsi.services.singlePoiService', [])

.factory('singlePoiService', function ($http, $q, Config) {
    var selectedPoi = null;

    var singlePoiService = {};
    var indexPoi = null;

    singlePoiService.setSelectedPoi = function (poi) {
        selectedPoi = poi;
    }

    singlePoiService.getSelectedPoi = function () {
        return selectedPoi;
    }

    singlePoiService.setIndexPoi = function (newIndex) {
        indexPoi = newIndex;
    }

    singlePoiService.getIndexPoi = function () {
        return indexPoi;
    }

    singlePoiService.uploadImages = function (images) {

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

    return singlePoiService;
});
