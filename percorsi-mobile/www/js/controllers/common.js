angular.module('roveretoPercorsi.controllers.common', [])

.factory('Toast', function ($rootScope, $timeout, $ionicPopup, $cordovaToast) {
	return {
		show: function (message, duration, position) {
			message = message || "There was a problem...";
			duration = duration || 'short';
			position = position || 'top';

			if (!!window.cordova) {
				// Use the Cordova Toast plugin
				$cordovaToast.show(message, duration, position);
			} else {
				if (duration == 'short') {
					duration = 2000;
				} else {
					duration = 5000;
				}

				var myPopup = $ionicPopup.show({
					template: "<div class='toast'>" + message + "</div>",
					scope: $rootScope,
					buttons: []
				});

				$timeout(function () {
					myPopup.close();
				}, duration);
			}
		}
	};
})

.factory('FilterVariable', function ($rootScope) {
	filterSocialTab = FILTERSOCIALTAB;
	filterSocialSlide = FILTERSOCIALSLIDE;
	filterAddImageButton = FILTERSOCIALADDIMAGE;
	filterMaxNumberSlide = FILTERMAXNUMBERSLIDE;
	return {
		getFilterSocialTab: function () {
			return filterSocialTab;
		},
		getFilterSocialSlide: function () {
			return filterSocialSlide;
		},
		getFilterAddImageButton: function () {
			return filterAddImageButton;
		},
		getFilterMaxNumberSlide: function () {
			return filterMaxNumberSlide;
		},
	};
})

.controller('AppCtrl', function ($scope, $rootScope, $cordovaDevice, $ionicModal, $ionicLoading, $ionicHistory, $timeout, $state, $stateParams, $filter, Toast, Config) {
	// Categories submenu
	$scope.categoriesSubmenu = false;
	$scope.version = Config.getVersion();
	$scope.toggleSubmenu = function () {
		$scope.categoriesSubmenu = !$scope.categoriesSubmenu;
	};

	// Modal 1
	$ionicModal.fromTemplateUrl('templates/login.html', {
		id: '1', // We need to use and ID to identify the modal that is firing the event!
		scope: $scope,
		backdropClickToClose: false,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.oModal1 = modal;
	});

	// Modal 2
	$ionicModal.fromTemplateUrl('templates/' + Config.credits, {
		id: '2', // We need to use and ID to identify the modal that is firing the event!
		scope: $scope,
		backdropClickToClose: false,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.oModal2 = modal;
	});
	$scope.startRatingSurvey = function () {
		startRatingSurvey(true);
	}
	$scope.openModal = function (index) {
		if (index == 1) $scope.oModal1.show();
		else $scope.oModal2.show();
	};

	$scope.closeModal = function (index) {
		if (index == 1) $scope.oModal1.hide();
		else $scope.oModal2.hide();
	};

	//    $scope.openSignal = function () {
	//        segnalaService.setSignal(null);
	//        window.location.assign('#/app/segnala/');
	//        $ionicHistory.nextViewOptions({
	//            disableAnimate: true,
	//            disableBack: true
	//        });
	//    };

	/* Listen for broadcasted messages */
	$scope.openLoginPopUp = function () {
		Toast.show($filter('translate')('toast_must_login'), 'short', 'bottom');
	};

	$scope.$on('modal.shown', function (event, modal) {
		console.log('Modal ' + modal.id + ' is shown!');
	});

	$scope.$on('modal.hidden', function (event, modal) {
		console.log('Modal ' + modal.id + ' is hidden!');
	});

	// Cleanup the modals when we're done with them (i.e: state change)
	// Angular will broadcast a $destroy event just before tearing down a scope
	// and removing the scope from its parent.
	$scope.$on('$destroy', function () {
		console.log('Destroying modals...');
		$scope.oModal1.remove();
		$scope.oModal2.remove();
	});

	/* Utils */
	$scope.m2km = function (m) {
		return Math.round((m / 1000) * 10) / 10;
	}

	$scope.min2time = function (min) {
		var hours = Math.floor(min / 60);
		var minutes = min % 60;

		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		return hours + '.' + minutes + ' h';
	}

	$scope.voteRound = function (vote) {
		return Math.round(vote * 10) / 10;
	}

	$scope.youtubeEmbed = function (url) {
		if (url) {
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[7].length == 11) {
				/*return 'http://img.youtube.com/vi/' + match[7] + '/0.jpg';*/
				return 'http://img.youtube.com/vi/' + match[7] + '/hqdefault.jpg';
				/*return 'http://img.youtube.com/vi/' + match[7] + '/mqdefault.jpg';*/
			} else {
				return null;
			}
		}
	}

	$scope.window = {
		open: function (url, target) {
			window.open(url, target);
		}
	};

	$scope.bringmethere = function (loc) {
		if (device != undefined && device.platform == "Android") {
			setTimeout(function () {
				window.open("http://maps.google.com/maps?daddr=" + loc[0] + "," + loc[1], "_system");
			}, 10);
		} else if (device != undefined && device.platform == "iOS") {
			var url = "maps:daddr=" + loc[0] + "," + loc[1];
			//successFn();
			setTimeout(function () {
				window.location = url;
			}, 10);
		} else {
			//console.error("Unknown platform");
			setTimeout(function () {
				window.open('http://maps.google.com/maps?daddr=' + loc[0] + ',' + loc[1], '_system');
			}, 10);
		}
		return false;
	};

	$scope.openLoginPopUp = function () {
		Toast.show($filter('translate')('toast_must_login'), 'short', 'bottom');
	};

	$ionicModal.fromTemplateUrl('templates/login-popup.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.loginModal = modal;
	});

	$scope.loginOpen = function (provider, credentials) {
		$ionicLoading.show();
		$rootScope.login(provider, credentials).then(function () {
			Toast.show($filter('translate')('login_done'), 'short', 'bottom');
			$state.go($state.current, $stateParams, {
				reload: true,
				inherit: false
			});
			$scope.loginModal.hide();
			$ionicLoading.hide();
		}, function (err) {
			Toast.show($filter('translate')('login_error'), 'long', 'bottom');
			$ionicLoading.hide();
		});
	};

	$scope.logoutOpen = function () {
		$rootScope.logout().then(function () {
			Toast.show($filter('translate')('logout_done'), 'short', 'bottom');
		});
	};

	$scope.loginClose = function () {
		$scope.loginModal.hide();
	};

	$scope.goToRegistration = function () {
		$scope.loginModal.hide();
		$state.go('app.registration');
	};
});

function showNoPlace() {
	var alertPopup = $ionicPopup.alert({
		title: $filter('translate')("signal_send_no_place_title"),
		template: $filter('translate')("signal_send_no_place_template"),
		buttons: [
			{
				text: $filter('translate')("signal_send_toast_alarm"),
				type: 'button-custom'
            }
        ]
	});

	alertPopup.then(function (res) {
		console.log('no place');
	});
};

function showNoConnection() {
	var alertPopup = $ionicPopup.alert({
		title: $filter('translate')("signal_send_no_connection_title"),
		template: $filter('translate')("signal_send_no_connection_template"),
		buttons: [
			{
				text: $filter('translate')("signal_send_toast_alarm"),
				type: 'button-custom'
            }
        ]
	});

	alertPopup.then(function (res) {
		console.log('no place');
	});
};

function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(60, 105),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
};
