angular.module('consoleControllers.paths', ['ngSanitize'])

// Paths controller
.controller('PathsCtrl', function ($scope, $rootScope, $sce, DataService) {
    $scope.$parent.mainView = 'paths';
    DataService.getPaths().then(function (data) {
        $scope.paths = data;
    });

    DataService.getCategories().then(function (data) {
        $scope.catList = data;
        // Get names of categories for each category of the path (because the path contains only the id)
        $scope.getCategoriesName = function (catOfPath) {
            var output = '';
            catOfPath.forEach(function (cat, idx) {
                $scope.catList.forEach(function (rootCat, i) {
                    if (cat == rootCat.id)
                        output += rootCat.name[$rootScope.languages[0]] + ", ";
                });
            });
            return output.slice(0, -2);
        };
    });

    $scope.trustHTML = function (code) {
        return $sce.trustAsHtml(code);
    }

    $scope.delete = function (idPoi) {
        $scope.paths.splice(idPoi, 1);
        DataService.savePaths($scope.paths).then(function () {
            DataService.getPaths().then(function (data) {
                $scope.paths = data;
            });
        });
    };
})

.controller('InfoCtrl', function ($scope, $rootScope, DataService) {
    $scope.$parent.selectedTab = 'info';
    // Get the categories list
    DataService.getCategories().then(function (data) {
        $scope.catList = data;
    });
})

.controller('MultimediaCtrl', function ($scope, $rootScope, uploadImageOnImgur) {
    $scope.$parent.selectedTab = 'multimedia';
    $scope.newMedia = {};
    // Add media to the current path
    $scope.addMedia = function () {
        switch ($scope.data.mediaType) {
        case 'image':
            $scope.currentPath.images.push($scope.newMedia);
            break;
        case 'video':
            $scope.currentPath.videos.push($scope.newMedia);
            break;
        case 'audio':
            $scope.currentPath.audios.push($scope.newMedia);
            break;
        default:
            alert("Errore: il tipo dell'oggetto non è un tipo valido (solo immagine, audio o video).");
        }
        // Reset the newMedia object
        $scope.newMedia = {};
    };

    $scope.delete = function (idx, array) {
        array.splice(idx, 1);
    };

    // Upload image on imgur
    $scope.uploadPic = function (file) {
        uploadImageOnImgur(file).success(function (response) {
            // Update the link of the new media with the imgur link
            $scope.newMedia.url = response.data.link;
            // Reset the input field
            $scope.file = null;
        });
    };

    // Switch views
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
})

.controller('PoisListCtrl', function ($scope, $rootScope, drawMap) {
    $scope.$parent.selectedTab = 'pois';
    $scope.remove = function (idPoi) {
        $scope.currentPath.pois.splice(idPoi, 1);
        drawMap.removeMarker(idPoi);
    };
})

.controller('MapCtrl', function ($scope, $rootScope, $timeout, drawMap, usSpinnerService) {
    $scope.$parent.selectedTab = 'map';
    $scope.initMap = function () {
        // Draw the map with pois of the path + shape
        drawMap.createMap('map', ($scope.currentPath.pois[0] == null ? {
            lat: '45.8832637',
            lng: '11.0014507'
        } : $scope.currentPath.pois[0].coordinates), $scope.currentPath.shape, function (shape) {
            $scope.currentPath.shape = shape;
            $scope.currentPath.length = drawMap.shapeLength();
            $scope.currentPath.time = drawMap.shapeTime();
            if (!$scope.$$phase)
                $scope.$apply();
        }, $scope.currentPath.pois);
    };

    // Updating the polyline on the map when the shape change
    $scope.updateShape = function () {
        drawMap.updatePoly($scope.currentPath.shape);
    };

    $scope.generatesPath = function () {
        drawMap.generatesPath($scope.currentPath.pois);
    };

    $scope.toggleMarkers = function () {
        $scope.toggle = !$scope.toggle;
        if ($scope.toggle)
            drawMap.showMarkers();
        else
            drawMap.hideMarkers();
    };

    $scope.editMap = false;
    $scope.spinnerIsLoading = false;
    $scope.editLine = function () {
        $scope.spinnerIsLoading = true;
        usSpinnerService.spin('map-spinner');
        $scope.editMap = !$scope.editMap;
        $timeout(function () {
            if ($scope.editMap)
                drawMap.editPoli();
            else
                drawMap.viewPoli();
            $scope.spinnerIsLoading = false;
        }, 50);
    }
})

// Edit an existing path
.controller('PathCtrl', function ($scope, $stateParams, $rootScope, $location, $timeout, DataService) {
    $scope.$parent.mainView = 'paths';
    DataService.getPaths().then(function (list) {
        $rootScope.paths = list;
        // Check if it should add or modify a path
        if ($stateParams.idPath) {
            // Check if the path was modified by poi page
            if ($rootScope.pathModified)
            // if true it means that the $scope.currentPath is already defined
                $rootScope.paths[$stateParams.idPath] = $scope.currentPath;
            else
                $scope.currentPath = $rootScope.paths[$stateParams.idPath];
        } else {
            if (!$rootScope.pathModified)
                $rootScope.paths.push({
                    images: [],
                    videos: [],
                    audios: [],
                    localId: makeid(),
                    pois: [],
                    shape: ''
                });

            $scope.currentPath = $rootScope.paths[$rootScope.paths.length - 1];
        }
    });

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return 'path' + text;
    }

    $rootScope.pathModified = false;

    // Set the default language to IT
    $scope.data = {
        lang: $rootScope.languages[0],
        mediaType: 'image'
    };

    // Reorder of the pois
    $scope.sortableOptions = {
        handle: ' .handle',
        axis: 'y'
    };

    // Save the changes made to the path
    $scope.save = function () {
        if (checkFields())
            DataService.savePaths($rootScope.paths).then(function () {
                // back to the home page
                $location.path('paths-list');
            });
        else {
            $rootScope.errorTexts = [];
            $rootScope.errorTexts.push("Errore! Tutti i campi con l'asterisco devono essere compilati e deve essere selezionata almeno una categoria, inoltre deve essere presente almeno una foto per il percorso e un punto di interesse");
            $timeout(function () {
                $rootScope.errorTexts = [];
            }, 5000);
        }
    };

    // Validation
    function checkFields() {
        var isValidate = true;
        var path = $scope.currentPath;

        if (!path.title || !path.description)
            isValidate = false;
        $rootScope.languages.forEach(function (lang, idx) {
            if (!path.title[lang] || !path.description[lang] || path.title[lang] == "" || path.description[lang] == "")
                isValidate = false;
        })

        if (path.images.length == 0 || path.pois.length == 0 || path.categories.length == 0)
            isValidate = false;

        return isValidate;
    }

    // Back without saving changes
    $scope.back = function () {
        if (confirm("Sei sicuro di voler uscire senza salvare? Le modifiche che hai effettuato andranno perse\nOk per uscire, annulla per annullare"))
            $location.path('paths-list');
    };
});