angular.module('roveretoPercorsi.services.galleryService', [])

.factory('galleryService', function ($http, $q, Config, FilterVariable) {
    var gallery = null;
    var notuserdefined = 0;
    var videos = 0;
    var userdefined = 0;
    var galleryService = {};
    var galleryof = null;
    galleryService.setGallery = function (passedGallery) {
        gallery = passedGallery;
    }

    galleryService.getGallery = function () {
        return gallery;
    }
    galleryService.getNumberOfnotuserdefined = function () {
        return notuserdefined;
    }
    galleryService.getNumberOfvideos = function () {
        return videos;
    }
    galleryService.getNumberOfuserdefined = function () {
        return userdefined;
    }
    galleryService.createGallery = function (item) {
        var gallery = [];
        if (item.images) {
            notuserdefined = 0;
            for (var i = 0; i < item.images.length; i++) {
                if (!item.images[i].userDefined) {
                    gallery.push({
                        url: item.images[i].url,
                        type: "image",
                        userDefined: false
                    });
                    notuserdefined++;
                }
            }
        }
        if (item.videos) {
            videos = 0;
            for (var i = 0; i < item.videos.length; i++) {
                gallery.push({
                    url: item.videos[i].url,
                    type: "video",
                    userDefined: false

                });
                videos++;
            }
        }
        if (item.images) {

            userdefined = 0;
            for (var i = 0; i < item.images.length; i++) {
                if (item.images[i].userDefined) {
                    gallery.push({
                        url: item.images[i].url,
                        type: "image",
                        userDefined: true
                    });
                    userdefined++;
                }
            }
        }
        return gallery;
    }

    galleryService.getItems = function (item) {

        //oggetto con url e type
var images = [];
var socialPresent = FilterVariable.getFilterSocialSlide()
var maxItems = FilterVariable.getFilterMaxNumberSlide();
///prendi tutte le immaginiufficiali
if (item.images) {
    for (var i = 0; i < item.images.length; i++) {
        if (!item.images[i].userDefined) {
            if (images.length < maxItems) {
                images.push({
                    url: item.images[i].url,
                    type: "picture"
                });
            }
        }
    }
}
//prendi tutti i video ufficiali
if (item.videos) {
    for (var i = 0; i < item.videos.length; i++) {
        if (images.length < maxItems) {

            images.push({
                url: item.videos[i].url,
                type: "video"
            });
        }
    }
}
//prendi tutte le immagini non ufficiali
if (socialPresent) {
    if (item.images) {
        for (var i = 0; i < item.images.length; i++) {
            if (item.images[i].userDefined) {
                if (images.length < maxItems) {

                    images.push({
                        url: item.images[i].url,
                        type: "picture"
                    });
                }
            }
        }
    }
}
//return images;
return images;
    }
    galleryService.isAPicture = function (item) {
        if (item.type == "picture") {
            return true;
        } else {
            return false;
        }
    }
    return galleryService;
});
