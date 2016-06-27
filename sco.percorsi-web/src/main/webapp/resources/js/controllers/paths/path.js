angular.module('consoleControllers.paths', ['ngSanitize'])

// Paths controller
.controller('PathsCtrl', function ($scope, $rootScope, $sce, $modal, DataService) {
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

    $scope.delete = function (idPath) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Attenzione!';
                },
                bodyText: function () {
                    return 'Confermi di voler cancellare il percorso ' + $scope.paths[idPath].title[$rootScope.languages[0]] + '?';
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.paths.splice(idPath, 1);
            DataService.savePaths($scope.paths).then(function () {
                DataService.getPaths().then(function (data) {
                    $scope.paths = data;
                });
            });
        });
    };
})



// Edit an existing path
.controller('PathCtrl', function ($scope, $stateParams, $rootScope, $location, $timeout, $modal, DataService) {
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
            $rootScope.modelErrors = "Errore! Controlla di aver compilato tutti i campi indicati con l'asterisco in tutte le lingue disponibili, di avere inserito almeno una foto e un punto di interesse prima di salvare.";
            $timeout(function () {
                $rootScope.modelErrors = '';
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
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Sei sicuro di uscire senza salvare?'
                },
                bodyText: function () {
                    return 'Le modifiche effettuate andranno perse.'
                }
            }
        });

        modalInstance.result.then(function () {
            $location.path('paths-list');
        });
    };
})

.controller('InfoCtrl', function ($scope, DataService) {
    $scope.$parent.selectedTab = 'info';
    // Get the categories list
    DataService.getCategories().then(function (data) {
        $scope.catList = data;
    });
})

.controller('PoisListCtrl', function ($scope, $modal) {
    $scope.$parent.selectedTab = 'pois';
    $scope.remove = function (idPoi) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Attenzione!'
                },
                bodyText: function () {
                    return 'Sei sicuro di voler cancellare la tappa selezionata?'
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.currentPath.pois.splice(idPoi, 1);
        });
    };
})

.controller('MultimediaCtrl', function ($scope, $modal, uploadImageOnImgur) {
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
});