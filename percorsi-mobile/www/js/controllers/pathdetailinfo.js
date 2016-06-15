angular.module('roveretoPercorsi.controllers.pathdetailinfo', [])

.controller('PathDetailInfoCtrl', function ($scope, $http, singlePathService, singlePoiService, $ionicModal, addImageService, $filter, $cordovaCamera, Toast, $ionicModal, $rootScope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $location, $ionicHistory, $ionicPopup, $rootScope, categoriesService, DatiDB, addImageService, galleryService, FilterVariable) {
    $scope.item = singlePathService.getSelectedPath();
    var gallery = galleryService.createGallery($scope.item);
    $scope.idPoiChoosen = null;
    $scope.expandedList = false;
    $scope.expandedDescritpion = false;
    $scope.group = {

    };
    $scope.images = [];

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */


    $scope.openLocConf = function () {
        var locConfPopup = $ionicPopup.confirm({
            template: $filter('translate')('setting_body_popup'),
            //title: $filter()('translate',
            scope: $scope,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: $filter('translate')('close'),
                    type: 'button-percorsi'
                                },
                {
                    text: $filter('translate')('setting_open_popup'),
                    type: 'button-percorsi',
                    onTap: function (e) {
                        return true;
                    }
                                    }]
        });
        locConfPopup.then(function (res) {
            if (res) {
                $scope.openGeoSettings();
            }
        });
    };
    $scope.openGeoSettings = function () {



        //
        //open popup for open settings
        if (typeof cordova.plugins.settings.openSetting != undefined) {
            if (ionic.Platform.isIOS()) {
                cordova.plugins.settings.open()
            } else cordova.plugins.settings.openSetting("location_source", function () {
                console.log("opened settings")
            }, function () {
                console.log("failed to settings")
            });
        }
    }
    $scope.noExtraListValues = function () {
        if ($scope.item.cost == null && $scope.item.parking == null && $scope.item.transport == null && $scope.item.accessibility == null) {
            return true
        }
        return false;
    }
    $scope.hideExpandListButton = function () {
        if (!$scope.expandedList) {
            return false;
        }
        return true;
    }

    $scope.hideCloseListButton = function () {
        if ($scope.expandedList) {
            return false;
        }
        return true;
    }
    $scope.toggleGroupList = function (group) {
        if ($scope.isGroupListShown(group)) {
            $scope.expandedList = false;
            $scope.shownGroup = null;

        } else {
            $scope.shownGroup = group;
            $scope.expandedList = true;

        }
    };
    $scope.isGroupListShown = function (group) {
        return $scope.shownGroup === group;
    };

    $scope.openGallery = function () {
        galleryService.setGallery(gallery);
        galleryService.galleryof = "path";
        window.location.assign("#/app/gallery");


    }
    $scope.translateDescription = function (descr) {
        return $filter('translate_remote')(descr);
        $scope.description = $sce.trustAsHtml($filter('translate_remote')(descr));

    }

    $scope.scrollTo = function (id) {
        $location.hash(id)
        $ionicScrollDelegate.anchorScroll(true);
    };
    $scope.toggleDescription = function () {
        if ($scope.isDescriptionShown()) {
            $scope.expandedDescritpion = false;
            $scope.scrollTo("firstSeparator");
        } else {
            $scope.expandedDescritpion = true;

        }
        $ionicScrollDelegate.resize();
    };

    $scope.getAllItems = function (item) {
        $scope.images = galleryService.getItems(item);
    }

    //$scope.images = $scope.getAllItems();

    $scope.isAPicture = function (item) {
        return galleryService.isAPicture(item);
    }

    $scope.getOfficialItems = function (arrayItems) {
        var arrayLength = arrayItems.length;
        var returnItems = [];
        for (var i = 0; i < arrayLength; i++) {
            if (!arrayItems[i].userDefined) {
                returnItems.push(arrayItems[i]);
            }
        }
        return returnItems;
    }

    $scope.isDescriptionShown = function () {
        return $scope.expandedDescritpion;
    };
    $scope.hideExpandDescriptionButton = function () {
        if (!$scope.isDescriptionShown()) {
            return false;
        }
        return true;
    };
    $scope.hideCloseDescriptionButton = function () {
        if ($scope.isDescriptionShown()) {
            return false;
        }
        return true;
    };
    singlePoiService.setIndexPoi(null);

    $scope.images = $scope.options = [{
        name: $filter('translate')('images_send_percorso_string'),
        id: 0
    }];

    for (var i = 0; i < ($scope.item.pois.length); i++) {
        $scope.options.push({
            name: $filter('translate_remote')($scope.item.pois[i].title),
            id: (i + 1)
        });
    }

    $scope.selectedOption = $scope.options[0];



    $scope.back = function () {
        window.location.assign("#/app/path");
    }



    $scope.showPoi = function (poiIndex) {
        singlePoiService.setSelectedPoi($scope.item.pois[poiIndex]);
        singlePoiService.setIndexPoi(poiIndex);
        window.location.assign('#/app/poidetail');
    };

});
