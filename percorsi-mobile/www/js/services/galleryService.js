angular.module('roveretoPercorsi.services.galleryService', [])

.factory('galleryService', function ($http, $q, Config) {
    var gallery = null;
    //var pathId = null;

    var galleryService = {};
    var galleryof = null;
    galleryService.setGallery = function (passedGallery) {
        gallery = passedGallery;
    }

    galleryService.getGallery = function () {
        return gallery;
    }

    galleryService.createGallery = function (item) {
        var gallery = [];
        if (item.images) {

            for (var i = 0; i < item.images.length; i++) {
                if (!item.images[i].userDefined) {
                    gallery.push({
                        url: item.images[i].url,
                        type: "image",
                        userDefined: false
                    });
                }
            }
        }
        if (item.videos) {

            for (var i = 0; i < item.videos.length; i++) {
                gallery.push({
                    url: item.videos[i].url,
                    type: "video",
                    userDefined: false

                });
            }
        }
        for (var i = 0; i < item.images.length; i++) {
            if (item.images[i].userDefined) {
                gallery.push({
                    url: item.images[i].url,
                    type: "image",
                    userDefined: true
                });
            }
        }
        return gallery;
    }
    return galleryService;
});
