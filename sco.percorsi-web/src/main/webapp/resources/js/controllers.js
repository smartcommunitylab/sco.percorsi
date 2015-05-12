var consoleControllers = angular.module('consoleControllers', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'DataService',
  function ($scope, $rootScope, $location, DataService) {
	$scope.modView = 'it.smartcommunitylab.percorsi.model.Path';
	$scope.moderated = {};
	
    DataService.getProfile().then(function(p){
    	$scope.profile = p;
    });

    $scope.uploadComplete = function (content) {
    	if (content.id) {
        	$scope.errorTexts = [];
        	$scope.successText = 'Data successfully uploaded!';
    		$scope.profile = content;
    	} else {
        	var txt = [];
        	if (content.errorMessage) {
        		txt.push(content.errorMessage);
        	} else {
        		txt.push("General server error");
        	}
        	$scope.successText = '';
    		$scope.errorTexts = txt;
    	}
    };

    $scope.exportPaths = function() {
    	window.open('console/export','_blank');
    };
    
    $scope.loadData = function() {
        DataService.getModerated('it.smartcommunitylab.percorsi.model.Path').then(function(data) {
        	$scope.moderated['it.smartcommunitylab.percorsi.model.Path'] = data;
        });
        DataService.getModerated('it.smartcommunitylab.percorsi.model.Rating').then(function(data) {
        	$scope.moderated['it.smartcommunitylab.percorsi.model.Rating'] = data;
        });
    };
    $scope.loadData();
    
    $scope.accept = function(obj, type) {
    	DataService.decide(type,obj.localId, obj.value, obj.contributor.userId, 'accept')
    	.then(function(data) {
    		$scope.moderated[type] = data;
    	});
    };
    $scope.reject = function(obj, type) {
    	DataService.decide(type,obj.localId, obj.value, obj.contributor.userId, 'reject')
    	.then(function(data) {
    		$scope.moderated[type] = data;
    	});
    };
    
  }]);
