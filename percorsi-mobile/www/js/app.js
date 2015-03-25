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
    'roveretoPercorsi.controllers.categories',
    'roveretoPercorsi.controllers.profile',
    'roveretoPercorsi.controllers.paths',
    'roveretoPercorsi.controllers.pathdetail',
    'roveretoPercorsi.controllers.pathdetailinfo',
    'roveretoPercorsi.controllers.pathdetailmap',
    'roveretoPercorsi.controllers.pathdetailturist',
    'roveretoPercorsi.services.conf',
    'roveretoPercorsi.services.login',
    'roveretoPercorsi.services.categories',
    'roveretoPercorsi.services.listPathsService',
    'roveretoPercorsi.services.singlePathService',
    'roveretoPercorsi.services.reviews'
])

.run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen, $state, $translate, Login, GeoLocate) {
    $rootScope.userIsLogged = (localStorage.userId != null && localStorage.userId != "null");

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

    //        .state('app.pathdetail', {
    //            cache: false,
    //
    //            url: '/pathdetail/:id',
    //            abstract: false,
    //            views: {
    //                'menuContent': {
    //                    templateUrl: "templates/pathdetail.html",
    //                    controller: 'PathDetailInfoCtrl'
    //
    //                }
    //            }
    //        })
    //
    //    // Each tab has its own nav history stack:
    //
    //    .state('app.pathdetail.info', {
    //        cache: false,
    //
    //        url: '/info/:id',
    //        views: {
    //            'app-pathdetail-info': {
    //                templateUrl: 'templates/pathdetail-info.html',
    //                controller: 'PathDetailInfoCtrl'
    //            }
    //        }
    //    })
    //
    //    .state('app.pathdetail.map', {
    //            cache: false,
    //
    //            url: '/map/:id',
    //            views: {
    //                'app-pathdetail-map': {
    //                    templateUrl: 'templates/pathdetail-map.html',
    //                    controller: 'PathDetailMapCtrl'
    //                }
    //            }
    //        })
    //        .state('app.pathdetail.turist', {
    //            cache: false,
    //            url: '/turist/:id',
    //            views: {
    //                'app-pathdetail-turist': {
    //                    templateUrl: 'templates/pathdetail-turist.html',
    //                    controller: 'PathDetailTuristCtrl'
    //                }
    //            }
    //        })

    .state('app.profile', {
        cache: false,
        url: '/profile',
        abstract: false,
        views: {
            'menuContent': {
                templateUrl: "templates/profile.html",
                controller: 'ProfileCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');

    $translateProvider.translations('it', {
        menu_home: 'Categorie / HOME',
        menu_profile: 'Profilo',
        menu_login: 'Accedi',
        menu_logout: 'Esci',
        menu_credits: 'Credits',
        categories_title: 'Rovereto Percorsi',
        credits_title: 'Credits',
        credits_app: 'Rovereto Percorsi',
        credits_project: 'Un progetto di:',
        credits_sponsored: 'Con la collaborazione di:',
        credits_info: 'Per informazioni:',
        paths_title: 'Percorsi'
    });

    $translateProvider.translations('en', {
        menu_home: 'Categories / HOME',
        menu_profile: 'Profile',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        categories_title: 'Rovereto Paths',
        credits_title: 'Credits',
        credits_app: 'Rovereto Paths',
        credits_project: 'A project by:',
        credits_sponsored: 'In collaboration with:',
        credits_info: 'Further information:',
        paths_title: 'Paths'
    });

    $translateProvider.translations('de', {
        menu_home: 'Categories / HOME',
        menu_profile: 'Profile',
        menu_login: 'Login',
        menu_logout: 'Logout',
        menu_credits: 'Credits',
        categories_title: 'Rovereto Paths',
        credits_title: 'Credits',
        credits_app: 'Rovereto Paths',
        credits_project: 'Ein projekt:',
        credits_sponsored: 'In Zusammenarbeit mit der:',
        credits_info: 'Informationen:',
        paths_title: 'Routen'
    });

    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
