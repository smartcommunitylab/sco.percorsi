// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('roveretoPercorsi', [
    'ionic',
    'ngCordova',
    'ngIOS9UIWebViewPatch',
    'ngSanitize',
    'leaflet-directive',
    'pascalprecht.translate',
    'services.geo',
    'roveretoPercorsi.filters',
    'roveretoPercorsi.directives',
    'roveretoPercorsi.controllers.common',
    'roveretoPercorsi.controllers.detailsslidebox',
    'roveretoPercorsi.controllers.galleryslidebox',
    'roveretoPercorsi.controllers.audioplayer',
    'roveretoPercorsi.controllers.categories',
    'roveretoPercorsi.controllers.profile',
    'roveretoPercorsi.controllers.paths',
    'roveretoPercorsi.controllers.pathdetail',
    'roveretoPercorsi.controllers.pathdetailinfo',
    'roveretoPercorsi.controllers.pathdetailmap',
    'roveretoPercorsi.controllers.pathdetailturist',
    'roveretoPercorsi.controllers.poidetail',
    'roveretoPercorsi.controllers.favorites',
    'roveretoPercorsi.controllers.gallery',
    'roveretoPercorsi.services.conf',
    'roveretoPercorsi.services.login',
    'roveretoPercorsi.services.categories',
    'roveretoPercorsi.services.listPathsService',
    'roveretoPercorsi.services.singlePathService',
    'roveretoPercorsi.services.singlePoiService',
    'roveretoPercorsi.services.addImageService',
    'roveretoPercorsi.services.galleryService',
    'roveretoPercorsi.services.reviews',
    'roveretoPercorsi.services.db',
    'roveretoPercorsi.services.favoritesService'
])

.run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen, $state, $translate, $q, $ionicHistory, $ionicConfig, Login, GeoLocate, Config) {
    $rootScope.userIsLogged = (localStorage.userId != null && localStorage.userId != "null");

    $rootScope.QUESTIONNAIRE = QUESTIONNAIRE;

    $rootScope.extLogging = function (app, msg) {
        if (EXTLOGGING) {
            Restlogging.appLog(app, msg);
        }
    };

    $rootScope.getUserId = function () {
        if ($rootScope.userIsLogged) {
            return localStorage.userId;
        }
        return null;
    };

    //    /* TEMP */
    //    $rootScope.userIsLogged = true;
    //    /* TEMP */

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
                    $rootScope.lang = data;
                }, function (error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }
        if (EXTLOGGING) {
            Restlogging.init("http://150.241.239.65:8080");
        }
        $rootScope.platform = ionic.Platform;
        $rootScope.backButtonStyle = $ionicConfig.backButton.icon();
    });

    $rootScope.login = function () {
        var deferred = $q.defer();
        Login.login().then(function (data) {
                deferred.resolve(data);
            },
            function (error) {

                deferred.reject(error);


            });
        return deferred.promise;

    }
    $rootScope.openFavorites = function () {
        window.location.assign('#/app/favorites');
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    };

    $rootScope.logout = function () {
        var deferred = $q.defer();
        Login.logout().then(function (data) {
                deferred.resolve(data);
            },
            function (error) {

                deferred.reject(error);


            });
        return deferred.promise;
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

    $rootScope.appName = Config.cityName;

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

    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.comeFrom = null;

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        //tmp workaraound for tabs
        if ($rootScope.currentState == "app.favorites") {
            $rootScope.comeFrom = "#app/favorites";
        }
        if ($rootScope.currentState == "app.paths") {
            $rootScope.comeFrom = "#/app/categories/" + toParams.id;
        }
        if ($rootScope.previousState == "app.pathdetail.info" && $rootScope.currentState == "app.pathdetail") {
            window.location.assign($rootScope.comeFrom);
        }

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
        cache: false,
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
                    templateUrl: "templates/paths.html",
                    controller: 'FavoritesCtrl'
                }
            }
        })
        .state('app.gallery', {
            cache: false,
            url: '/gallery',
            abstract: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery.html",
                    controller: 'GalleryCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');

    $translateProvider.translations('it', {
        menu_home: 'Home',
        menu_favorites: 'Preferiti',
        menu_login: 'Accedi',
        menu_logout: 'Esci',
        menu_credits: 'Credits',
        path_info: 'Info',
        path_map: 'Mappa',
        path_turist: 'Social',
        path_difficulty: 'Difficoltà',
        path_difficulty_1: 'Bassa',
        path_difficulty_2: 'Media',
        path_difficulty_3: 'Alta',
        path_itinerary: 'ITINERARIO',
        archive_empty_list: 'Nessun percorso',
        categories_title: 'Tesori Nascosti',
        credits_title: 'Credits',
        credits_app: 'Tesori Nascosti',
        credits_project: 'Un progetto di:',
        credits_sponsored: 'Con la collaborazione di:',
        credits_info: 'Per informazioni:',
        pathdetailmap_startpath: 'INIZIA PERCORSO',
        pathdetailmap_goto: 'Vai',
        pathdetailinfo_vote: 'Voto',
        pathdetailturist_vote: 'Vota',
        pathdetailturist_votes: 'Recensioni',
        pathdetailturist_review: 'Recensisci',
        pathdetailturist_review_label: 'Recensione',
        pathdetailturist_review_hint: 'Inserisci una tua recensione',
        pathdetailturist_voteinfo: 'Valuta il percorso',
        pathdetailtourist_empty_list: 'Non sono presenti recensioni',
        pathdetailtourist_anonymous: 'Anonimo',
        pathdetailtourist_your_review: 'La tua valutazione',
        newreview_popup_title: 'Aggiungi la tua valutazione',
        newreview_popup_cancel: 'Chiudi',
        newreview_popup_ok: 'Conferma',
        vote_sent_toast_ok: 'Voto registrato',
        review_sent_toast_ok: 'Recensione inviata',
        addImage_popup_ok: 'Ok',
        addImage_popup_cancel: 'Annulla',
        addImage_label: 'Aggiungi un\'immagine',
        addImage_isEmpty: 'Inserire un\'immagine valida',
        images_send_toast_ok: 'Nuove immagini aggiunte con successo',
        images_send_toast_error: 'Problema nell\'invio delle immagini',
        toast_must_login: 'Funzione disabilitata. Devi accedere al sistema',
        poi_add_image_popup: 'Associa a ',
        images_send_percorso_string: 'Percorso',
        close: 'Chiudi',
        details: 'Dettagli',
        login_label: 'Login',
        login_message: 'Per utilizzare la funzionalità devi prima effettuare il login',
        login_popup_cancel: 'Non adesso',
        login_popup_ok: 'Login',
        login_done: 'Login effettuato con successo',
        logout_done: 'Logout effettuato con successo',
        syncing: 'aggiornamento in corso...',
        cleaning: 'pulizia in corso...',
        review_empty_error: 'Inserire uuna recensione',
        path_tracks_title: 'TRACCE AUDIO',
        path_more_information: 'Più informazioni',
        path_less_information: 'Meno informazioni',
        gallery_title: 'Immagini',
        empty_gallery: 'Nessuna immagine presente',
        modal_istitutional: 'Foto istituzionale',
        modal_public: 'Foto utenti',
        preview_label: 'Anteprima',
        avg_rating: 'VOTO MEDIO',
        audio_starting: 'Avvio traccia audio',
        credits_licenses_button: 'VEDI LICENZE',
        path_informations: 'INFORMAZIONI',
        orderby_alphabetically: 'Alfabetico',
        orderby_general: 'Ordinamento',
        orderby_length: 'Lunghezza',
        orderby_time: 'Tempo di percorrenza',
        orderby_difficulty: 'Difficoltà',
        orderby_distance: 'Distanza dalla partenza',
        geolocation_error_message: 'Geolocalizzazione non attiva',
        setting_open_popup: 'Impostazioni',
        setting_title_popup: 'Impostazioni',
        setting_body_popup: 'Attiva la geolocalizzazione del tuo dispositivo per visualizzare la distanza',
        oder_popup_ok: 'Ordina',
        path_from_me: 'dalla tua posizione'

    });

    $translateProvider.translations('en', {
        menu_home: 'Home',
        menu_favorites: 'Bookmarks',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        archive_empty_list: 'No paths',
        categories_title: 'Hidden Treasures',
        path_info: 'Info',
        path_map: 'Map',
        path_turist: 'Social',
        path_difficulty: 'Difficulty',
        path_difficulty_1: 'Low',
        path_difficulty_2: 'Medium',
        path_difficulty_3: 'Hard',
        path_itinerary: 'ROUTE',
        credits_title: 'Credits',
        credits_app: 'Hidden Treasures',
        credits_project: 'A project by:',
        credits_sponsored: 'In collaboration with:',
        credits_info: 'Further information:',
        pathdetailmap_startpath: 'START ROUTE',
        pathdetailmap_goto: 'Go',
        pathdetailinfo_vote: 'Rating',
        pathdetailturist_vote: 'Rate',
        pathdetailturist_votes: 'Reviews',
        pathdetailturist_review_label: 'Review',
        pathdetailturist_review_hint: 'Review',
        pathdetailturist_review: 'Add a review',
        pathdetailturist_voteinfo: 'Rate this itinerary',
        pathdetailtourist_empty_list: 'Sorry, no reviews',
        pathdetailtourist_anonymous: 'Anonymous',
        pathdetailtourist_your_review: 'Your review',
        newreview_popup_title: 'Add your rating',
        newreview_popup_cancel: 'Close',
        newreview_popup_ok: 'Confirm',
        vote_sent_toast_ok: 'Vote registered',
        review_sent_toast_ok: 'Review sent',
        addImage_popup_ok: 'Ok',
        addImage_popup_cancel: 'Cancel',
        addImage_label: 'Add an image',
        addImage_isEmpty: 'Please, select a valid image',
        images_send_toast_ok: 'New images added successfully',
        images_send_toast_error: 'Error adding images',
        toast_must_login: 'Function disabled. You must login',
        poi_add_image_popup: 'Add to',
        images_send_percorso_string: 'Path',
        close: 'Close',
        details: 'Details',
        login_label: 'Login',
        login_message: 'You must login to use this functionality',
        login_popup_cancel: 'Not now',
        login_popup_ok: 'Login',
        login_done: 'Login done',
        logout_done: 'Logout done',
        syncing: 'Syncing....',
        cleaning: 'Cleaning...',
        review_empty_error: 'Insert a review',
        path_tracks_title: 'AUDIO TRACKS',
        path_more_information: 'More information',
        path_less_information: 'Less information',
        gallery_title: 'Images',
        empty_gallery: 'No images',
        modal_istitutional: 'Official photos',
        modal_public: 'User photos',
        preview_label: 'Preview',
        avg_rating: 'AVERAGE RATING',
        audio_starting: 'Start audiotrack',
        credits_licenses_button: 'READ LICENSES',
        path_informations: 'INFORMATION',
        orderby_alphabetically: 'Alphabetically',
        orderby_general: 'Order by',
        orderby_length: 'Length',
        orderby_time: 'Travel time',
        orderby_difficulty: 'Difficulty',
        orderby_distance: 'Distance',
        geolocation_error_message: 'Location services are disabled',
        setting_open_popup: 'Settings',
        setting_title_popup: 'Settings',
        setting_body_popup: 'Enable location services on your device to display the distance',
        oder_popup_ok: 'Order',
        path_from_me: 'by distance from your location'



    });

    $translateProvider.translations('de', {
        menu_home: 'Home',
        menu_favorites: 'Bookmarks',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        categories_title: 'Geheime Schätze',
        archive_empty_list: 'Kein route',
        path_info: 'Info',
        path_map: 'Karte',
        path_turist: 'Social',
        path_difficulty: 'Schwierigkeitsgrad',
        path_difficulty_1: 'Leicht',
        path_difficulty_2: 'Mittel',
        path_difficulty_3: 'Schwer',
        path_itinerary: 'ROUTE',
        favorites_emptylist: '',
        credits_title: 'Credits',
        credits_app: 'Geheime Schätze',
        credits_project: 'Ein projekt von:',
        credits_sponsored: 'In Zusammenarbeit mit:',
        credits_info: 'Weitere Informationen:',
        pathdetailmap_startpath: 'ROUTE STARTEN',
        pathdetailmap_goto: 'Gehen',
        pathdetailinfo_vote: 'Rating',
        pathdetailturist_vote: 'Bewerten',
        pathdetailturist_votes: 'Reviews',
        pathdetailturist_review_label: 'Fazit schreiben',
        pathdetailturist_review_hint: 'Fazit',
        pathdetailturist_review: 'Fazit veröffentlichen',
        pathdetailturist_voteinfo: 'Bewertung hinzufügen',
        pathdetailtourist_empty_list: 'Keine Reviews',
        pathdetailtourist_anonymous: 'Anonym',
        pathdetailtourist_your_review: 'Ihre Bewertung',
        newreview_popup_title: 'Bewertung hinzufügen',
        newreview_popup_cancel: 'Schließen',
        newreview_popup_ok: 'Bestätigen',
        vote_sent_toast_ok: 'Bewertung aufgezeichnet',
        review_sent_toast_ok: 'Fazit aufgezeichnet',
        addImage_popup_ok: 'OK',
        addImage_popup_cancel: 'Abbrechen',
        addImage_label: 'Bild hinzufügen',
        addImage_isEmpty: 'Bitte wählen Sie ein gültiges Bildformat',
        images_send_toast_ok: 'Neue Bilder wurden erfolgreich hinzugefügt',
        images_send_toast_error: 'Fehler beim Hinzufügen von Bildern',
        toast_must_login: 'Funktion nicht verfügbar: Login erforderlich',
        poi_add_image_popup: 'Verbinde mit',
        images_send_percorso_string: 'Weg',
        close: 'Schließen',
        details: 'Details',
        login_label: 'Login',
        login_message: 'Man muss eingeloggt sein um diese Funktion zu nutzen',
        login_popup_cancel: 'Nicht jetzt',
        login_popup_ok: 'Login',
        login_done: 'Login erfolgreich',
        logout_done: 'Logout erfolgreich',
        syncing: 'Aktualisierung im Gange...',
        cleaning: 'Reinigung im Gange...',
        review_empty_error: 'Fazit veröffentlichen',
        path_tracks_title: 'AUDIO',
        path_more_information: 'Mehr Informationen',
        path_less_information: 'Weniger Informationen',
        gallery_title: 'Fotos',
        empty_gallery: 'Keine Fotos vorhanden',
        modal_istitutional: 'Offizielle Fotos',
        modal_public: 'Benutzerfotos',
        preview_label: 'Vorschau',
        avg_rating: 'Durchschnittliche Bewertung',
        audio_starting: 'Führen audiospur',
        credits_licenses_button: 'SIEHE LIZENZEN',
        path_informations: 'INFORMATIONEN',
        orderby_alphabetically: 'Alphabetically',
        orderby_general: 'Order by',
        orderby_length: 'Length',
        orderby_time: 'Travel time',
        orderby_difficulty: 'Difficulty',
        orderby_distance: 'Distance',
        geolocation_error_message: 'Ortungsdienste sind deaktiviert',
        setting_open_popup: 'Einstellungen',
        setting_title_popup: 'Einstellungen',
        setting_body_popup: 'Ortungsdienste auf dem Gerät aktivieren um die Entfernung anzuzeigen',
        oder_popup_ok: 'Ordnen',
        path_from_me: 'nach Entfernung von deiner Position'




    });

    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
