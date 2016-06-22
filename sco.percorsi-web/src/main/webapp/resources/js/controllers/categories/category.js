angular.module('consoleControllers.categories', [])

// Categories management
.controller('CategoriesCtrl', function ($scope, $rootScope, $timeout, DataService) {
    $scope.$parent.mainView = 'categories';
    // Get the list of all categories from the server
    DataService.getCategories().then(function (catList) {
        if (!$rootScope.paths)
            DataService.getPaths().then(function (list) {
                $rootScope.paths = list;
                $rootScope.catList = catList;
            });
        else
            $rootScope.catList = catList;
    });

    // Delete the category selected
    $scope.delete = function (idCat) {
        if (!checkCategory(idCat)) {
            $rootScope.catList.splice(idCat, 1);
            // DataService to server
            var postRequest = {
                "appId": $rootScope.profile.id,
                "localId": '1',
                "categories": $rootScope.catList
            };
            DataService.saveCategories(postRequest).then(function () {
                DataService.getCategories().then(function (list) {
                    $rootScope.catList = list;
                });
            });
        } else {
            // Tell to user that this action is impossible
            $rootScope.errorTexts = [];
            $rootScope.errorTexts.push("Impossibile eliminare la categoria " + $rootScope.catList[idCat].name[$rootScope.languages[0]] + " perchè almeno un percorso è assegnato ad essa");
            $timeout(function () {
                $rootScope.errorTexts = [];
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
        $rootScope.paths.forEach(function (path, idx) {
            if (path.categories.indexOf($rootScope.catList[idCat].id) != -1)
                isUsed = true;
        });
        return isUsed;
    };

    $scope.calPathsOfCategory = function (idCat) {
        var numberOfPaths = 0;
        $rootScope.paths.forEach(function (path, idx) {
            if (path.categories.indexOf($rootScope.catList[idCat].id) != -1)
                numberOfPaths++;
        });
        return numberOfPaths;
    }

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
                "categories": $rootScope.catList
            };
            DataService.saveCategories(postRequest);
        }
    }
})

.controller('CategoryCtrl', function ($scope, $rootScope, $stateParams, $location, $timeout, DataService, uploadImageOnImgur) {
    if ($stateParams.idCat)
        $scope.cat = $rootScope.catList[$stateParams.idCat];
    else {
        $rootScope.catList.push({
            "id": makeid()
        });
        $scope.cat = $rootScope.catList[$rootScope.catList.length - 1];
    }

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
                "categories": $rootScope.catList
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
            $rootScope.errorTexts = [];
            $rootScope.errorTexts.push("Errore! Tutti i campi con bordo rosso sono richiesti per il salvataggio e devono essere compilati");
            $timeout(function () {
                $rootScope.errorTexts = [];
            }, 5000);
            allCompiled = false;
        }
        return allCompiled;
    }

    $scope.back = function () {
        $location.path('categories-list');
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