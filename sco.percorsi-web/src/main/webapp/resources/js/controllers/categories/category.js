angular.module('consoleControllers.categories', [])

// Categories management
.controller('CategoriesCtrl', function ($scope, $rootScope, $timeout, $modal, DataService) {
    $scope.$parent.mainView = 'categories';
    $scope.$parent.mainView = 'categories';
    // Get the list of all categories from the server
    DataService.getCategories().then(function (catList) {
        DataService.getPaths().then(function (list) {
            $scope.paths = list;
            $scope.catList = catList;
            $scope.calPathsOfCategory = function (idCat) {
                var numberOfPaths = 0;
                $scope.paths.forEach(function (path, idx) {
                    if (path.categories.indexOf($scope.catList[idCat].id) != -1)
                        numberOfPaths++;
                });
                return numberOfPaths;
            }
        });

    });

    // Delete the category selected
    $scope.delete = function (idCat) {
        if (!checkCategory(idCat)) {
            var modalInstance = $modal.open({
                templateUrl: 'templates/modal.html',
                controller: 'ModalCtrl',
                size: 'lg',
                resolve: {
                    titleText: function () {
                        return 'Attenzione!';
                    },
                    bodyText: function () {
                        return 'Confermi di voler cancellare la categoria ' + $scope.catList[idCat].name[$rootScope.languages[0]] + '?';
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.catList.splice(idCat, 1);
                // DataService to server
                var postRequest = {
                    "appId": $rootScope.profile.id,
                    "localId": '1',
                    "categories": $scope.catList
                };
                DataService.saveCategories(postRequest).then(function () {
                    DataService.getCategories().then(function (list) {
                        $scope.catList = list;
                    });
                });
            });
        } else {
            // Tell to user that this action is impossible
            $rootScope.modelErrors = "Impossibile eliminare la categoria " + $scope.catList[idCat].name[$rootScope.languages[0]] + " perchè almeno un percorso è assegnato ad essa";
            $timeout(function () {
                $rootScope.modelErrors = '';
            }, 5000);
        }
    };
    /*
    *   return
            true: if the category is used at least from one path;
            false: if the category isn't used by any path;
    */
    function checkCategory(idCat) {
        var isUsed = false;
        $scope.paths.forEach(function (path, idx) {
            if (path.categories.indexOf($scope.catList[idCat].id) != -1)
                isUsed = true;
        });
        return isUsed;
    };

    $scope.sortableOptions = {
        handle: ' .handle',
        axis: 'y'
    };

    $scope.order = function () {
        $scope.enableOrder = !$scope.enableOrder;
        if (!$scope.enableOrder) {
            // DataService to server
            var postRequest = {
                "appId": $rootScope.profile.id,
                "localId": '1',
                "categories": $scope.catList
            };
            DataService.saveCategories(postRequest);
        }
    }
})

.controller('CategoryCtrl', function ($scope, $rootScope, $stateParams, $location, $timeout, $modal, DataService, uploadImageOnImgur) {
    $scope.$parent.mainView = 'categories';
    DataService.getCategories().then(function (list) {
        $scope.catList = list;
        if ($stateParams.idCat)
            $scope.cat = $scope.catList[$stateParams.idCat];
        else {
            $scope.catList.push({
                "id": makeid()
            });
            $scope.cat = $scope.catList[$scope.catList.length - 1];
        }
    });

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    $scope.lang = $rootScope.languages[0];

    $scope.save = function () {
        // Check if the fields have been entered
        if (checkFields()) {
            var postRequest = {
                "appId": $rootScope.profile.id,
                "localId": '1',
                "categories": $scope.catList
            };
            DataService.saveCategories(postRequest).then(function () {
                $location.path('categories-list');
            });
        }
    };

    function checkFields() {
        var allCompiled = true;
        var emptyFields = $('.error');
        // Get all inputs
        if (emptyFields.length > 0) {
            $rootScope.modelErrors = "Errore! Controlla di aver compilato tutti i campi indicati con l'asterisco in tutte le lingue disponibili prima di salvare.";
            $timeout(function () {
                $rootScope.modelErrors = '';
            }, 5000);
            allCompiled = false;
        }
        return allCompiled;
    }

    $scope.back = function () {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                titleText: function () {
                    return 'Sei sicuro di voler uscire senza salvare?';
                },
                bodyText: function () {
                    return 'Le modifiche effettuate andranno perse.'
                }
            }
        });

        modalInstance.result.then(function () {
            $location.path('categories-list');
        });
    }

    // Upload image on imgur
    $scope.uploadPic = function (file) {
        uploadImageOnImgur(file).success(function (response) {
            // Update the link of the new media with the imgur link
            $scope.cat.image = response.data.link;
            // Reset the input field
            $scope.file = null;
        });
    }
});