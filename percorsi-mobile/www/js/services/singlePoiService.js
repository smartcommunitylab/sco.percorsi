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

    return singlePoiService;
});
