angular.module('DataService', [])
    .factory('DataService', [
        '$q', '$http', '$rootScope',
  function ($q, $http, $rootScope)
        {
            var URL = '';
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
                    $http.get(URL + '/console/provider', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getPaths: function () {
                    var deferred = $q.defer();
                    $http.get(URL + '/console/paths', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getCategories: function () {
                    var deferred = $q.defer();
                    $http.get(URL + '/console/categories', options).success(function (data) {
                        deferred.resolve(data.categories);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                savePaths: function (data) {
                    var deferred = $q.defer();
                    $http.post(URL + '/console/paths', data, options).success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                saveCategories: function (data) {
                    var deferred = $q.defer();
                    $http.post(URL + '/console/categories', data, options).success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                publish: function () {
                    var deferred = $q.defer();
                    $http.post(URL + '/console/publish', options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getModerated: function (type, paging) {
                    var deferred = $q.defer();
                    $http.get(URL + '/console/moderated/' + type + '?start=' + paging.page + '&count=' + paging.size, options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                decide: function (type, localId, value, contributor, action) {
                    var deferred = $q.defer();
                    $http.post(URL + '/console/moderated/' + type + '/' + localId + '/' + contributor + '/' + action + '?value=' + encodeURIComponent(value), options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                remove: function (type, localId, value, contributor) {
                    var deferred = $q.defer();
                    $http.delete(URL + '/console/moderated/' + type + '/' + localId + '/' + contributor + '/?value=' + encodeURIComponent(value), options).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                logout: logout
            };
  }
]);