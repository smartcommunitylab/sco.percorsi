angular.module('roveretoPercorsi.services.galleryService', [])

.factory('galleryService', function ($http, $q, Config) {
    var gallery = null;
    //var pathId = null;

    var galleryService = {};

    galleryService.setGallery = function (passedGallery) {
        gallery = passedGallery;
    }

    galleryService.getGallery = function () {
        return gallery;
    }

    return galleryService;
});
