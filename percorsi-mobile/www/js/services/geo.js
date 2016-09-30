angular.module('services.geo', [])

.factory('GeoLocate', function ($q, $rootScope, $ionicPlatform, leafletData) {
	var service = {};
	var positionError = null;
	var localization = undefined;

	var startLocalization = function () {
		if (typeof localization == 'undefined') {
			localization = $q.defer();
			if (ionic.Platform.isWebView()) {
				//console.log('geolocalization initing (cordova)...');
				document.addEventListener('deviceready', function () {
					//console.log('geolocalization inited (cordova)');
					if (!positionError || (!!positionError && positionError.code != 1)) {
						$rootScope.locationWatchID = navigator.geolocation.watchPosition(function (position) {
							r = [position.coords.latitude, position.coords.longitude];
							$rootScope.myPosition = r;
							localization.resolve(r);
						}, function (error) {
							positionError = error;
							console.log('Cannot geolocate (cordova)');
							localization.reject('Cannot geolocate (cordova), error.code: ' + error.code);
						}, {
							//frequency: (20 * 60 * 1000), //20 mins
							maximumAge: (10 * 6 * 1000), //10 mins
							timeout: 6 * 1000, //1 minute
							enableHighAccuracy: (device.version.indexOf('2.') == 0) // true for Android 2.x
						});
					} else {
						localization.reject('Cannot geolocate (permission denied)');
					}
				}, false);
			} else {
				//console.log('geolocalization inited (web)');
				$rootScope.locationWatchID = navigator.geolocation.watchPosition(function (position) {
					r = [position.coords.latitude, position.coords.longitude];
					$rootScope.myPosition = r;
					//console.log('geolocated (web)');
					localization.resolve(r);
				}, function (error) {
					positionError = error;
					console.log('cannot geolocate (web)');
					localization.reject('cannot geolocate (web)');
				}, {
					maximumAge: (10 * 60 * 1000), // 10 minutes
					timeout: 10 * 1000, // 10 seconds
					enableHighAccuracy: false
				});
			}
		}

		return localization.promise;
	};

	service.initLocalization = function () {
		document.addEventListener('deviceready', function () {
			console.log('Check geolocation permissions');

			navigator.geolocation.getCurrentPosition(
				function (position) {
					console.log('Gelocation permitted and active');
					startLocalization()
				},
				function (error) {
					positionError = error;
					console.log('Cannot geolocate (cordova)');
					if (error.code != 1) {
						console.log('Geolocation permission denied!');
						startLocalization();
					}
				}, {
					timeout: 100
				});
		}, false);
	};

	service.clearWatch = function () {
		navigator.geolocation.clearWatch($rootScope.locationWatchID);
		$rootScope.locationWatchID = undefined;
	};

	service.reset = function () {
		localization = undefined;
	};

	service.locate = function () {
		//console.log('geolocalizing...');
		return startLocalization().then(function (latlng) {
			return $rootScope.myPosition;
		});
	};

	service.distance = function (pt1, pt2) {
		var d = false;
		if (pt1 && pt1[0] && pt1[1] && pt2 && pt2[0] && pt2[1]) {
			var lat1 = Number(pt1[0]);
			var lon1 = Number(pt1[1]);
			var lat2 = Number(pt2[0]);
			var lon2 = Number(pt2[1]);

			var R = 6371; // km
			//var R = 3958.76; // miles
			var dLat = (lat2 - lat1).toRad();
			var dLon = (lon2 - lon1).toRad();
			var lat1 = lat1.toRad();
			var lat2 = lat2.toRad();
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			d = R * c;
		} else {
			console.log('cannot calculate distance!');
		}
		return d;
	};

	service.initMap = function (mapId) {
		var deferred = $q.defer();

		leafletData.getMap(mapId).then(function (map) {
				L.tileLayer('http://{s}.tile.openstreetmap.org/cycle/{z}/{x}/{y}.png', {
					type: 'map',
					ext: 'jpg',
					attribution: '',
					subdomains: '1234',
					maxZoom: 18
				}).addTo(map);
				map.invalidateSize();
				deferred.resolve(map);
			},
			function (error) {
				console.log('error creation');
				deferred.reject(error);
			});
		return deferred.promise;
	};

	service.distanceTo = function (gotoPosition) {
		var GL = this;
		return localization.promise.then(function (myPosition) {
			//console.log('myPosition: ' + JSON.stringify(myPosition));
			//console.log('gotoPosition: ' + JSON.stringify(gotoPosition));
			return GL.distance(myPosition, gotoPosition);
		});
	};

	return service;
})

.factory('mapConversionService', function ($q, $rootScope) {
	var polyline = {};
	var mapConversionService = {};
	// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
	//
	// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
	// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

	mapConversionService.encode = function (coordinate, factor) {
		coordinate = Math.round(coordinate * factor);
		coordinate <<= 1;
		if (coordinate < 0) {
			coordinate = ~coordinate;
		}
		var output = '';
		while (coordinate >= 0x20) {
			output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
			coordinate >>= 5;
		}
		output += String.fromCharCode(coordinate + 63);
		return output;
	}

	// This is adapted from the implementation in Project-OSRM
	// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
	mapConversionService.decode = function (str, precision) {
		var index = 0,
			lat = 0,
			lng = 0,
			coordinates = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, precision || 5);

		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < str.length) {

			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			shift = result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			lat += latitude_change;
			lng += longitude_change;

			coordinates.push([lat / factor, lng / factor]);
		}

		return coordinates;
	};

	mapConversionService.encode = function (coordinates, precision) {
		if (!coordinates.length) return '';

		var factor = Math.pow(10, precision || 5),
			output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

		for (var i = 1; i < coordinates.length; i++) {
			var a = coordinates[i],
				b = coordinates[i - 1];
			output += encode(a[0] - b[0], factor);
			output += encode(a[1] - b[1], factor);
		}

		return output;
	};
	return mapConversionService;
});
