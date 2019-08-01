angular.module('consoleControllers.poi', [])

// Edit the poi for the selected path
.controller('PoiCtrl', function ($scope, $stateParams, $rootScope, $window, $timeout, $modal, DataService, uploadImageOnImgur, drawMapPoi) {
    $scope.$parent.selectedTab = 'pois';
    // Check if the current path variable is null or not
    if (!$scope.$parent.currentPath) {
        // Create $parent variable (the logic is the same of PathCtrl)
        if ($stateParams.idPath)
            DataService.getPaths().then(function (list) {
                $scope.$parent.currentPath = list[$stateParams.idPath];
                InitPoiPage();
            });
        else {
            $scope.$parent.currentPath = {
                images: [],
                videos: [],
                audios: [],
                localId: makeid(),
                pois: [],
                shape: ''
            };
            InitPoiPage();
        }
    } else {
        InitPoiPage();
    }

    // Create $scope.poi variable and init the map
    function InitPoiPage() {
        if ($stateParams.idPoi)
            $scope.poi = angular.copy($scope.$parent.currentPath.pois[$stateParams.idPoi]);
        else
            $scope.poi = {
                "title": {
                    "de": "",
                    "it": "",
                    "en": ""
                },
                "description": {
                    "de": "",
                    "it": "",
                    "en": ""
                },
                "coordinates": {
                    lat: '45.8832637',
                    lng: '11.0014507'
                },
                "images": [],
                "videos": [],
                "audios": [],
                "localId": $scope.$parent.currentPath.localId + 'poi' + $scope.$parent.currentPath.pois.length + 1
            };
        drawMapPoi.createMap('map-poi', $scope.poi.coordinates.lat, $scope.poi.coordinates.lng, function (lat, lng) {
            $scope.poi.coordinates.lat = lat;
            $scope.poi.coordinates.lng = lng;
            $scope.$apply();
        });
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return 'path' + text;
    }

    // Update the marker position when the user change coordinates
    $scope.updateMarkerPosition = function () {
        drawMapPoi.updateMarker($scope.poi.coordinates.lat, $scope.poi.coordinates.lng);
    }

    // language of fields
    $scope.lang = $rootScope.languages[0];
    // Media type
    $scope.mediaType = "image";

    $scope.newMedia = {};

    // Add new media item to the poi
    $scope.addMedia = function () {
        switch ($scope.mediaType) {
        case 'image':
            $scope.poi.images.push($scope.newMedia);
            break;
        case 'video':
            $scope.poi.videos.push($scope.newMedia);
            break;
        case 'audio':
            $scope.poi.audios.push($scope.newMedia);
            break;
        default:
            alert("Errore: il tipo dell'oggetto non è un tipo valido (solo immagine, audio o video).");
        }
        // Reset the newMedia object
        $scope.newMedia = {};
    }

    $scope.save = function () {
        if (checkFields()) {
            if ($stateParams.idPoi)
                $scope.$parent.currentPath.pois[$stateParams.idPoi] = $scope.poi;
            else
                $scope.$parent.currentPath.pois.push($scope.poi);

            $rootScope.pathModified = true;
            // Back to the path
            $window.history.back();
        }
    }

    function checkFields() {
        var allCompiled = true;
        var emptyFields = $('.error');
        // Get all inputs
        if (emptyFields.length > 0 || $scope.poi.images.length == 0) {
            $rootScope.modelErrors = "Errore! Controlla di aver compilato tutti i campi indicati con l'asterisco in tutte le lingue disponibili e di avere inserito almeno una foto prima di salvare.";
            $timeout(function () {
                $rootScope.modelErrors = '';
            }, 5000);
            allCompiled = false;
        }
        return allCompiled;
    }

    // Exit without saving changes
    $scope.back = function () {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Sei sicuro di uscire senza salvare?';
                },
                bodyText: function () {
                    return 'Le modifiche effettuate andranno perse.'
                }
            }
        });

        modalInstance.result.then(function () {
            $window.history.back();
        });
    }

    // Upload image on imgur
    $scope.uploadPic = function (file) {
        uploadImageOnImgur(file).success(function (response) {
            // Update the link of the new media with the imgur link
            $scope.newMedia.url = response.data.link;
            // Reset the input field
            $scope.file = null;
        });
    }

    $scope.delete = function (idx, array) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Attenzione!';
                },
                bodyText: function () {
                    return 'Sei sicuro di voler cancellare questo oggetto?';
                }
            }
        });

        modalInstance.result.then(function () {
            array.splice(idx, 1);
        });
    };

    $scope.copyOfImages = {};
    $scope.copyOfVideos = {};
    $scope.copyOfAudios = {};

    /* orArray = original $scope array;
     * cpArray = copy of original $scope array;     
     */
    $scope.push = function (index, orArray, cpArray) {
        cpArray[index] = angular.copy(orArray[index]);
    }
    $scope.pop = function (orArray, cpArray, index, save) {
        if (save)
            orArray[index] = cpArray[index];

        cpArray[index] = null;
    }
});