angular.module('roveretoPercorsi.controllers.registration', [])

.controller('RegistrationCtrl', function ($scope, $rootScope, $state, $filter, LoginService, Config, Toast) {
	$scope.newUser = {
		email: null,
		password: null,
		passwordagain: null
	};

	$scope.register = function (user) {
		var regUser = angular.copy(user);
		delete regUser.passwordagain;

		LoginService.register(regUser).then(
			function (result) {
				Toast.show($filter('translate')('registration_successful'), 'short', 'bottom');
				$state.go('app.categories');
			},
			function (reason) {
              Toast.show($filter('translate')('register_error'), 'long', 'bottom');
              $ionicLoading.hide();
				console.log(reason);
			}
		);
	};
});
