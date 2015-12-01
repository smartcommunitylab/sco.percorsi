angular.module('DataService', [])
.factory('DataService',[
        '$q','$http', '$rootScope',
  function($q, $http, $rootScope)
  {
    var logout = function() {
      var data = $q.defer();
      $http.post('logout',{}).success(function() {
        data.resolve();
      }, function() {
        data.resolve();
      });
      return data.promise;
    };

    return {
       getProfile : function() {
          var deferred = $q.defer();
          $http.get('console/data').success(function(data) {
            deferred.resolve(data);
          }).error(function(e) {
            deferred.reject(e);
          });
          return deferred.promise;
       },
       getModerated : function(type, paging) {
           var deferred = $q.defer();
           $http.get('console/moderated/'+type+'?start='+paging.page+'&count='+paging.size).success(function(data) {
             deferred.resolve(data);
           }).error(function(e) {
             deferred.reject(e);
           });
           return deferred.promise;
       },
       decide : function(type, localId, value, contributor, action) {
           var deferred = $q.defer();
           $http.post('console/moderated/'+type+'/'+localId+'/'+contributor+'/'+action+'?value='+encodeURIComponent(value)).success(function(data) {
             deferred.resolve(data);
           }).error(function(e) {
             deferred.reject(e);
           });
           return deferred.promise;
       },
       remove : function(type, localId, value, contributor) {
           var deferred = $q.defer();
           $http.delete('console/moderated/'+type+'/'+localId+'/'+contributor+'/?value='+encodeURIComponent(value)).success(function(data) {
             deferred.resolve(data);
           }).error(function(e) {
             deferred.reject(e);
           });
           return deferred.promise;
       },
	   logout : logout
    };
  }
]);
