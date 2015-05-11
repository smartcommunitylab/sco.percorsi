var consoleControllers = angular.module('consoleControllers', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'DataService',
  function ($scope, $rootScope, $location, DataService) {
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
    	window.open('export','_blank');
    };
    
  }]);
