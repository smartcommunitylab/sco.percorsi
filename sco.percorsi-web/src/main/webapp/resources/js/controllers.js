var consoleControllers = angular.module('consoleControllers', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'DataService',
  function ($scope, $rootScope, $location, DataService) {
	$scope.view = 'model';
	$scope.switchView = function(view) {
		$scope.view = view;
	}
	
	$scope.modView = 'it.smartcommunitylab.percorsi.model.Path';
	$scope.moderated = {};
	$scope.paging = {'it.smartcommunitylab.percorsi.model.Path':{page:0, size: 5}, 'it.smartcommunitylab.percorsi.model.Rating':{page:0, size: 5}};
	
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
    
    $scope.publish = function() {
    	DataService.publish($scope.profile.id);
    };

    $scope.next = function(type) {
    	if ($scope.moderated[type].length < $scope.paging[type].size) return;
    	
    	$scope.paging[type].page++;
    	$scope.loadData(type);
    }
    $scope.prev = function(type) {
    	if ($scope.paging[type].page == 0) return;
    	$scope.paging[type].page--;
    	$scope.loadData(type);
    }
    
    $scope.loadData = function(type) {
    	if (!type || type == 'it.smartcommunitylab.percorsi.model.Path')
	        DataService.getModerated('it.smartcommunitylab.percorsi.model.Path', $scope.paging['it.smartcommunitylab.percorsi.model.Path']).then(function(data) {
	        	$scope.moderated['it.smartcommunitylab.percorsi.model.Path'] = data;
	        });
    	if (!type || type == 'it.smartcommunitylab.percorsi.model.Rating')
	        DataService.getModerated('it.smartcommunitylab.percorsi.model.Rating', $scope.paging['it.smartcommunitylab.percorsi.model.Rating']).then(function(data) {
	        	$scope.moderated['it.smartcommunitylab.percorsi.model.Rating'] = data;
	        });
    };
    $scope.loadData();
    
    $scope.accept = function(obj, type) {
    	DataService.decide(type,obj.localId, obj.value, obj.contributor.userId, 'accept')
    	.then(function(data) {
    		$scope.loadData(type);
    	});
    };
    $scope.remove = function(obj, type) {
    	DataService.remove(type,obj.localId, obj.value, obj.contributor.userId)
    	.then(function(data) {
    		$scope.loadData(type);
    	});
    };
    $scope.reject = function(obj, type) {
    	DataService.decide(type,obj.localId, obj.value, obj.contributor.userId, 'reject')
    	.then(function(data) {
    		$scope.loadData(type);
    	});
    };
    
  }]);
