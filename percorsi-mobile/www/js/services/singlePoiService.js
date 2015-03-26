angular.module('roveretoPercorsi.services.singlePoiService', [])

.factory('singlePoiService', function ($http, $q) {
    var selectedPoi = null;

    var singlePoiService = {};

    singlePoiService.setSelectedPoi = function (poi) {
        selectedPoi = poi;
    }

    singlePoiService.getSelectedPoi = function () {
        return selectedPoi;
    }

    return singlePoiService;
});
