angular.module('consoleControllers.paths', ['ngSanitize'])

// Paths controller
.controller('PathsCtrl', function ($scope, $rootScope, $sce, DataService) {
    DataService.getPaths().then(function (data) {
        $rootScope.paths = data;
    });

    DataService.getCategories().then(function (data) {
        $rootScope.catList = data;
    });

    $scope.trustHTML = function (code) {
        return $sce.trustAsHtml(code);
    }

    $scope.delete = function (idPoi) {
        $rootScope.paths.splice(idPoi, 1);
        DataService.savePaths($rootScope.paths).then(function () {
            DataService.getPaths().then(function (data) {
                $rootScope.paths = data;
            });
        });
    };

    // Get names of categories for each category of the path (because the path contains only the id)
    $scope.getCategoriesName = function (catOfPath) {
        var output = '';
        catOfPath.forEach(function (cat, idx) {
            $rootScope.catList.forEach(function (rootCat, i) {
                if (cat == rootCat.id)
                    output += rootCat.name[$rootScope.languages[0]] + ", ";
            });
        });
        return output.slice(0, -2);
    };
})

// Edit an existing path
.controller('PathCtrl', function ($scope, $stateParams, $rootScope, $location, $timeout, DataService, uploadImageOnImgur, drawMap) {
    // Active tab
    $scope.selectedTab = 'info';
    // Check if it should add or modify a path
    if ($stateParams.idPath)
        $scope.currentPath = $rootScope.paths[$stateParams.idPath];
    else {
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

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return 'path' + text;
    }

    // Set the root current path (for change or add a new poi)
    $rootScope.currentPath = $scope.currentPath;

    $rootScope.pathModified = false;

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

    // Get the categories list
    DataService.getCategories().then(function (data) {
        $scope.catList = data;
    });

    // Set the default language to IT
    $scope.data = {
        lang: $rootScope.languages[0]
    };

    $scope.mediaType = 'image';
    $scope.newMedia = {};

    // Add media to the current path
    $scope.addMedia = function () {
        switch ($scope.mediaType) {
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

    $scope.remove = function (idPoi) {
        $scope.currentPath.pois.splice(idPoi, 1);
        drawMap.removeMarker(idPoi);
    };

    // Save the changes made to the path
    $scope.save = function () {
        if (checkFields())
            DataService.savePaths($rootScope.paths).then(function () {
                // back to the home page
                $location.path('paths-list');
            });
    };

    function checkFields() {
        var allCompiled = true;
        var emptyFields = $('.error');

        if (emptyFields.length > 0 || $scope.currentPath.images.length == 0 || $scope.currentPath.pois.length == 0 || $scope.currentPath.categories.length == 0) {
            $rootScope.errorTexts = [];
            $rootScope.errorTexts.push("Errore! Tutti i campi con bordo rosso devono essere compilati e deve essere selezionata almeno una categoria, inoltre deve essere presente almeno una foto per il percorso e un punto di interesse");
            $timeout(function () {
                $rootScope.errorTexts = [];
            }, 5000);
            allCompiled = false;
        }
        return allCompiled;
    }

    // Back without saving changes
    $scope.back = function () {
        if (confirm("Sei sicuro di voler uscire senza salvare? Le modifiche che hai effettuato andranno perse\nOk per uscire, annulla per annullare"))
            $location.path('paths-list');
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

    // Reorder of the pois
    $scope.sortableOptions = {
        handle: ' .handle',
        axis: 'y'
    };
});