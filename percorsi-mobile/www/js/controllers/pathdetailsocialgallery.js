angular.module('roveretoPercorsi.controllers.pathdetailsocialgallery', [])

.controller('PathDetailSocialGalleryCtrl', function($scope, singlePathService) {	
	$scope.item = singlePathService.getSelectedPath();
	
	$scope.openImage = function(index) {
		alert(index);	
	};
});
