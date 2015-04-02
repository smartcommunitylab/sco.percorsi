angular.module('roveretoPercorsi.services.conf', [])

.factory('Config', function ($q, $http, $window, $filter, $rootScope) {

    var URL = 'https://dev.smartcommunitylab.it/percorsi';
    var userdata = 'userdata/paths';
    var appId = 'ComuneRovereto';
    var service = 'problems';

    var cityName = {
        'it': 'Rovereto',
        'en': 'Rovereto',
        'de': 'Rovereto'
    };



    return {

        getVersion: function () {
            return 'v ' + APP_VERSION + (APP_BUILD && APP_BUILD != '' ? '<br/>(' + APP_BUILD + ')' : '');
        },
        getLang: function () {
            var browserLanguage = '';
            // works for earlier version of Android (2.3.x)
            var androidLang;
            if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                browserLanguage = androidLang[1];
            } else {
                // works for iOS, Android 4.x and other devices
                browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
            }
            var lang = browserLanguage.substring(0, 2);
            if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
            return lang;
        },
        getProfile: function () {
            //console.log('getProfile()');
            var profileLoaded = $q.defer();
            //console.log('localStorage.cachedProfile: '+localStorage.cachedProfile);
            if (localStorage.cachedProfile && localStorage.cachedProfile != 'undefined' && localStorage.cachedProfile != 'null') {
                //console.log('using locally cached profile');
                profileLoaded.resolve(parseConfig(JSON.parse(localStorage.cachedProfile)));
            } else {
                //console.log('getting predefined profile');
                $http.get('data/' + LOCAL_PROFILE + '.json').success(function (data, status, headers, config) {
                    localStorage.cachedProfile = JSON.stringify(data);
                    $rootScope.$emit('profileUpdated');
                    profileLoaded.resolve(parseConfig(data));
                }).error(function (data, status, headers, config) {
                    console.log('error getting predefined config "data/' + LOCAL_PROFILE + '.json"!');
                    profileLoaded.reject();
                });
            }
            return profileLoaded.promise;
        },
        getLanguage: function () {

            navigator.globalization.getLocaleName(
                function (locale) {
                    alert('locale: ' + locale.value + '\n');
                },
                function () {
                    alert('Error getting locale\n');
                }
            );

        },
        highlights: function () {
            return this.getProfile().then(function (data) {
                //console.log(data.highlights[0].image);
                //data.highlights._parent={ id: 'highlights' };
                return data.highlights;
            });
        },
        navigationItems: function () {
            return this.getProfile().then(function (data) {
                return data.navigationItems;
            });
        },
        navigationItemsGroup: function (label) {
            return this.navigationItems().then(function (items) {
                for (gi = 0; gi < items.length; gi++) {
                    if (items[gi].id == label) return items[gi];
                }
                return null;
            });
        },

        keys: function () {
            return keys;
        },
        URL: function () {
            return URL;
        },
        userdata: function () {
            return userdata;
        },
        service: function () {
            return service;
        },
        appId: function () {
            return appId;
        },
        schemaVersion: function () {
            return SCHEMA_VERSION;
        },
        getHomeHighlightsMax: function () {
            return HOME_HIGHLIGHTS_MAX;
        },
        syncUrl: function () {
            //console.log('$rootScope.TEST_CONNECTION: '+(!!$rootScope.TEST_CONNECTION));
            var SYNC_MODE = (!!$rootScope.TEST_CONNECTION ? 'syncdraft' : 'sync');
            //console.log('SYNC_MODE: '+SYNC_MODE);
            return 'https://' + SYNC_HOST + '.smartcommunitylab.it/' + SYNC_WEBAPP + '/' + SYNC_MODE + '/' + WEBAPP_MULTI + '?since=';
        },
        syncTimeoutSeconds: function () {
            //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
            return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
            //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
            //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
        },
        syncingOverlayTimeoutMillis: function () {
            return 50 * 1000; /* seconds before automatically hiding syncing overlay */
        },
        loadingOverlayTimeoutMillis: function () {
            return 20 * 1000; /* seconds before automatically hiding loading overlay */
        },
        fileDatadirMaxSizeMB: function () {
            return 100;
        },
        fileCleanupTimeoutSeconds: function () {
            return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
        },
        fileCleanupOverlayTimeoutMillis: function () {
            return 20 * 1000; /* seconds before automatically hiding cleaning overlay */
        },
        contentTypesList: function () {
            return contentTypes;
        },
        contentKeyFromDbType: function (dbtype) {
            for (var contentType in contentTypes) {
                if (contentTypes.hasOwnProperty(contentType)) {
                    if (contentTypes[contentType] == dbtype) return contentType;
                }
            }
            return '';
        },
        textTypesList: function () {
            return textTypes;
        },

        cityName: function () {
            return cityName;
        },
        imagePath: function () {
            return imagePath;
        },
        dbName: function () {
            return dbName;
        },
        doProfiling: function () {
            return false;
        }
    }
})

.factory('Profiling', function (Config) {
    var reallyDoProfiling = Config.doProfiling();
    var startTimes = {};
    return {
        start2: function (label) {
            startTimes[label] = (new Date).getTime();
        },
        start: function (label) {
            if (reallyDoProfiling) this.start2(label);
        },

        _do2: function (label, details, info) {
            var startTime = startTimes[label] || -1;
            if (startTime != -1) {
                var nowTime = (new Date).getTime();
                console.log('PROFILING: ' + label + (details ? '(' + details + ')' : '') + '=' + (nowTime - startTime));
                //if (details) startTimes[label]=nowTime;
                if (!!info) console.log(info);
            }
        },
        _do: function (label, details, info) {
            if (reallyDoProfiling) this._do2(label, details);
        }
    };
})
