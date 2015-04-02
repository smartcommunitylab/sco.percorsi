// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('roveretoPercorsi', [
    'ionic',
    'ngCordova',
    'leaflet-directive',
    'pascalprecht.translate',
    'services.geo',
    'roveretoPercorsi.filters',
    'roveretoPercorsi.directives',
    'roveretoPercorsi.controllers.common',
    'roveretoPercorsi.controllers.detailsslidebox',
    'roveretoPercorsi.controllers.audioplayer',
    'roveretoPercorsi.controllers.categories',
    'roveretoPercorsi.controllers.profile',
    'roveretoPercorsi.controllers.paths',
    'roveretoPercorsi.controllers.pathdetail',
    'roveretoPercorsi.controllers.pathdetailinfo',
    'roveretoPercorsi.controllers.pathdetailmap',
    'roveretoPercorsi.controllers.pathdetailturist',
    'roveretoPercorsi.controllers.poidetail',
    'roveretoPercorsi.services.conf',
    'roveretoPercorsi.services.login',
    'roveretoPercorsi.services.categories',
    'roveretoPercorsi.services.listPathsService',
    'roveretoPercorsi.services.singlePathService',
    'roveretoPercorsi.services.singlePoiService',
    'roveretoPercorsi.services.addImageService',
    'roveretoPercorsi.services.reviews'
])

.run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen, $state, $translate, Login, GeoLocate) {
    $rootScope.userIsLogged = (localStorage.userId != null && localStorage.userId != "null");

    /* TEMP */
    $rootScope.userIsLogged = true;
    /* TEMP */

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function (language) {
                $translate.use((language.value).split("-")[0]).then(function (data) {
                    console.log("SUCCESS -> " + data);
                }, function (error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }
        Restlogging.init("http://150.241.239.65:8080");
    });

    $rootScope.login = function () {
        Login.login();
    };

    $rootScope.logout = function () {
        Login.logout();
    };

    // for BlackBerry 10, WP8, iOS
    setTimeout(function () {
        $cordovaSplashscreen.hide();
        //navigator.splashscreen.hide();
    }, 3000);

    $rootScope.locationWatchID = undefined;
    //  ionic.Platform.fullScreen(false,true);
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }

    document.addEventListener("pause", function () {
        console.log('app paused');
        if (typeof $rootScope.locationWatchID != 'undefined') {
            navigator.geolocation.clearWatch($rootScope.locationWatchID);
            $rootScope.locationWatchID = undefined;
            GeoLocate.reset();
            console.log('geolocation reset');
        }
    }, false);

    document.addEventListener("resume", function () {
        console.log('app resumed');
        GeoLocate.locate();
    }, false);

    GeoLocate.locate().then(function (position) {
        $rootScope.myPosition = position;
        //console.log('first geolocation: ' + position);
    }, function () {
        console.log('CANNOT LOCATE!');
    });
})

.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.categories', {
        cache: false,
        url: "/categories",
        views: {
            'menuContent': {
                templateUrl: "templates/categories.html",
                controller: 'CategoriesCtrl'
            }
        }
    })

    .state('app.paths', {
        url: "/categories/:id",
        views: {
            'menuContent': {
                templateUrl: "templates/paths.html",
                controller: 'PathsCtrl'
            }
        }
    })

    .state('app.pathdetail', {
        cache: false,
        url: '/path',
        abstract: false,
        views: {
            'menuContent': {
                templateUrl: "templates/pathdetail.html",
                controller: 'PathDetailCtrl'
            }
        }
    })

    // Each tab has its own nav history stack:
    .state('app.pathdetail.info', {
        cache: false,
        url: '/info',
        views: {
            'app-pathdetail-info': {
                templateUrl: 'templates/pathdetail-info.html',
                controller: 'PathDetailInfoCtrl'
            }
        }
    })

    .state('app.pathdetail.map', {
        cache: false,
        url: '/map',
        views: {
            'app-pathdetail-map': {
                templateUrl: 'templates/pathdetail-map.html',
                controller: 'PathDetailMapCtrl'
            }
        }
    })

    .state('app.pathdetail.turist', {
        cache: false,
        url: '/turist',
        views: {
            'app-pathdetail-turist': {
                templateUrl: 'templates/pathdetail-turist.html',
                controller: 'PathDetailTuristCtrl'
            }
        }
    })

    .state('app.poidetail', {
        cache: false,
        url: '/poidetail',
        abstract: false,
        views: {
            'menuContent': {
                templateUrl: "templates/poidetail.html",
                controller: 'PoiDetailCtrl'
            }
        }
    })

    .state('app.favorites', {
        cache: false,
        url: '/favorites',
        abstract: false,
        views: {
            'menuContent': {
                templateUrl: "templates/favorites.html",
                controller: 'ProfileCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');

    $translateProvider.translations('it', {
        menu_home: 'Categorie / HOME',
        menu_favorites: 'Preferiti',
        menu_login: 'Accedi',
        menu_logout: 'Esci',
        menu_credits: 'Credits',
        path_info: 'Info',
        path_map: 'Mappa',
        path_turist: 'Turista',
        path_difficulty_1: 'Bassa',
        path_difficulty_2: 'Media',
        path_difficulty_3: 'Alta',
        path_itinerary: 'Itinerario',
        categories_title: 'Rovereto Percorsi',
        credits_title: 'Credits',
        credits_app: 'Rovereto Percorsi',
        credits_project: 'Un progetto di:',
        credits_sponsored: 'Con la collaborazione di:',
        credits_info: 'Per informazioni:',
        pathdetailmap_startpath: 'INIZIA PERCORSO',
        pathdetailmap_goto: 'Vai qui',
        pathdetailturist_vote: 'Vota',
        pathdetailturist_review: 'Recensisci',
        pathdetailturist_voteinfo: 'Vota il percorso',
        newreview_popup_title: 'Aggiungi la tua recensione',
        newreview_popup_cancel: 'Chiudi',
        newreview_popup_ok: 'Conferma',
        vote_sent_toast_ok: 'Voto registrato',
        review_sent_toast_ok: 'Recensione inviata',
        addImage_popup_ok: 'Ok',
        addImage_popup_cancel: 'Annulla',
        addImage_label: 'Aggiungi immagini',
        images_send_toast_ok: 'Nuove immagini aggiunte con successo',
        images_send_toast_error: 'Problema nell\'invio delle immagini',
        toast_must_login: 'Funzione disabilitata. Devi accedere al sistema',
        poi_add_image_popup: 'Associa a POI',
        images_send_percorso_string: 'Percorso',
        close: 'Chiudi',
        details: 'Dettagli'
    });

    $translateProvider.translations('en', {
        menu_home: 'Categories / HOME',
        menu_favorites: 'Bookmarks',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        categories_title: 'Rovereto Paths',
        path_info: 'Info',
        path_map: 'Map',
        path_turist: 'Tourist',
        path_difficulty_1: 'Low',
        path_difficulty_2: 'Medium',
        path_difficulty_3: 'Hard',
        path_itinerary: 'Itinerary',
        credits_title: 'Credits',
        credits_app: 'Rovereto Paths',
        credits_project: 'A project by:',
        credits_sponsored: 'In collaboration with:',
        credits_info: 'Further information:',
        pathdetailmap_startpath: 'START PATH',
        pathdetailmap_goto: 'Go there',
        pathdetailturist_vote: 'Vote',
        pathdetailturist_review: 'Add a review',
        pathdetailturist_voteinfo: 'Vote the path',
        newreview_popup_title: 'Add your review',
        newreview_popup_cancel: 'Close',
        newreview_popup_ok: 'Confirm',
        vote_sent_toast_ok: 'Vote registered',
        review_sent_toast_ok: 'Review sent',
        addImage_popup_ok: 'Ok',
        addImage_popup_cancel: 'Cancel',
        addImage_label: 'Add images',
        images_send_toast_ok: 'New images added successfuylly',
        images_send_toast_error: 'Error adding images',
        toast_must_login: 'Function disabled. You must login',
        poi_add_image_popup: 'Choose the POI',
        images_send_percorso_string: 'Path',
        close: 'Close',
        details: 'Details'
    });

    $translateProvider.translations('de', {
        menu_home: 'Categories / HOME',
        menu_favorites: 'Bookmarks',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        categories_title: 'Rovereto Paths',
        path_info: 'Info',
        path_map: 'Karte',
        path_turist: 'Turista',
        path_difficulty_1: 'Leicht',
        path_difficulty_2: 'Halb',
        path_difficulty_3: 'Schwer',
        path_itinerary: 'Reiseroute',
        credits_title: 'Credits',
        credits_app: 'Rovereto Paths',
        credits_project: 'Ein projekt:',
        credits_sponsored: 'In Zusammenarbeit mit der:',
        credits_info: 'Informationen:',
        pathdetailmap_startpath: 'START REISEPLAN',
        pathdetailmap_goto: 'Gehen',
        pathdetailturist_vote: 'Bewerten',
        pathdetailturist_review: 'Rezension',
        pathdetailturist_voteinfo: 'Vote the path',
        newreview_popup_title: 'Kommentar abgeben',
        newreview_popup_cancel: 'Aussteigen',
        newreview_popup_ok: 'Bestätigung',
        vote_sent_toast_ok: 'Vote registered',
        review_sent_toast_ok: 'Review sent',
        addImage_popup_ok: 'OK',
        addImage_popup_cancel: 'Schließen',
        addImage_label: 'Bilder hinzufügen',
        images_send_toast_ok: 'Neue Bilder wurden erfolgreich hinzugefügt',
        images_send_toast_error: 'Fehler beim Hinzufügen von Bildern',
        toast_must_login: 'Wählen Sie POI',
        images_send_percorso_string: 'Path',
        close: 'Schließen',
        details: 'Einzelheiten'
    });

    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
