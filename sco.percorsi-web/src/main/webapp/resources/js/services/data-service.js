angular.module('DataService', [])
    .factory('DataService', [
        '$q', '$http', '$rootScope', '$timeout',
  function ($q, $http, $rootScope, $timeout)
        {
            var options = {};
            var logout = function () {
                var data = $q.defer();
                $http.post('logout', {}).success(function () {
                    data.resolve();
                }, function () {
                    data.resolve();
                });
                return data.promise;
            };

            return {
                getProfile: function () {
                    var deferred = $q.defer();
                    $http.get('console/provider', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getPaths: function () {
                    var deferred = $q.defer();
                    $http.get('console/paths', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        $rootScope.modelErrors = e == '' ? 'Errore di connessione, riprova più tardi' : e.errorCode + ': ' + e.errorMessage;
                        $timeout(function () {
                            $rootScope.modelErrors = '';
                        }, 6000);
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getCategories: function () {
                    var deferred = $q.defer();
                    $http.get('console/categories', options).success(function (data) {
                        deferred.resolve(data.categories);
                    }).error(function (e) {
                        $rootScope.modelErrors = e == '' ? 'Errore di connessione, riprova più tardi' : e.errorCode + ': ' + e.errorMessage;
                        $timeout(function () {
                            $rootScope.modelErrors = '';
                        }, 6000);
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                savePaths: function (data) {
                    var deferred = $q.defer();
                    $http.post('console/paths', data, options).success(function (data, status, headers, config) {
                        $rootScope.modelSuccessText = "Dati dei percorsi salvati e caricati correttamente sul server";
                        $timeout(function () {
                            $rootScope.modelSuccessText = '';
                        }, 6000);
                        deferred.resolve(data);
                    }).error(function (e) {
                        $rootScope.modelErrors = e == '' ? 'Errore di connessione, riprova più tardi' : e.errorCode + ': ' + e.errorMessage;
                        $timeout(function () {
                            $rootScope.modelErrors = '';
                        }, 6000);
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                saveCategories: function (data) {
                    var deferred = $q.defer();
                    $http.post('console/categories', data, options).success(function (data, status, headers, config) {
                        $rootScope.modelSuccessText = "Dati delle categorie salvati e caricati sul server correttamente";
                        $timeout(function () {
                            $rootScope.modelSuccessText = '';
                        }, 6000);
                        deferred.resolve(data);
                    }).error(function (e) {
                        $rootScope.modelErrors = e == '' ? 'Errore di connessione, riprova più tardi' : e.errorCode + ': ' + e.errorMessage;
                        $timeout(function () {
                            $rootScope.modelErrors = '';
                        }, 6000);
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                publish: function () {
                    var deferred = $q.defer();
                    $http.post('console/publish', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getModerated: function (type, paging) {
                    var deferred = $q.defer();
                    $http.get('console/moderated/' + type + '?start=' + paging.page + '&count=' + paging.size, options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                decide: function (type, localId, value, contributor, action) {
                    var deferred = $q.defer();
                    $http.post('console/moderated/' + type + '/' + localId + '/' + contributor + '/' + action + '?value=' + encodeURIComponent(value), options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                remove: function (type, localId, value, contributor) {
                    var deferred = $q.defer();
                    $http.delete('console/moderated/' + type + '/' + localId + '/' + contributor + '/?value=' + encodeURIComponent(value), options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                logout: logout
            };
  }
])

.service('ShareMedia', function () {
    var obj;

    return {
        getObj: function () {
            return obj;
        },
        setObj: function (value) {
            obj = value;
        }
    };
});