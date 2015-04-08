angular.module('roveretoPercorsi.controllers.categories', [])

.controller('CategoriesCtrl', function ($scope, $rootScope, $http, categoriesService, DatiDB, Config) {
    $scope.categories = {};
    $scope.noMoreCategoriesAvailable = false;

    $scope.loadMore = function () {
        var length = 0;

        if ($scope.categories.data) {
            length = $scope.categories.data.length;
        }

        categoriesService.getCategoriesList(length).then(function (categories) {
            //check state for array
            $scope.emptylist = false;
            if ($scope.categories.data) {
                $scope.categories.data.push.apply($scope.categories.data, categories.data);
                if (categories.data) {
                    if (categories.data.length < categoriesService.getMaxCounter()) {
                        $scope.noMoreCategoriesAvailable = true;
                    }
                }
                /* temp */
                if (categories.length == 0) {
                    $scope.noMoreCategoriesAvailable = true;
                } /* temp */
            } else {
                $scope.categories = categories;
                $rootScope.categories = categories;
            }

            if ($scope.categories.data.length == 0) {
                $scope.emptylist = true;
            } else {
                $scope.emptylist = false;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    $scope.setSelectedCategory = function (category) {
        categoriesService.setSelectedCategory(category);
    }


    //    var defaultHighlight = {
    //        id: null,
    //        name: Config.cityName(),
    //        image: 'img/hp-box/city.png',
    //        ref: 'info'
    //    };
    DatiDB.sync().then(function (data) {
        //        /*
        //            var homeObjects = JSON.parse(localStorage.homeObjects);
        //            DatiDB.getAny(homeObjects).then(function (data) {
        //              var highlights = [defaultHighlight];
        //              for (var i = 0; i < data.length; i++) highlights.push(data[i]);
        //              $scope.highlights = highlights;
        //            });
        //        */
        //        Config.highlights().then(function (items) {
        //            if (items && items.length) {
        //                //console.log('highlights.length: '+items.length);
        //                var highlights = [];
        //
        //                var hlVerifiedObjects = [],
        //                    hlVerificationsPromises = [],
        //                    MAX = Config.getHomeHighlightsMax();
        //                for (hli = 0; hli < items.length && hli < MAX; hli++) {
        //                    var item = items[hli];
        //                    if (item.objectIds) {
        //                        //console.log('adding items "'+item.objectIds+'"...');
        //                        hlVerificationsPromises.push(DatiDB.checkIDs(item.objectIds, item).then(function (ids) {
        //                            hlVerifiedObjects.push(ids);
        //                            //console.log('verified items "'+ids+'"');
        //                        }, function (rr) {
        //                            console.log('missing objectIds "' + rr[0] + '" ' + (rr[1] && rr[1].id ? 'for highlight item "' + rr[1].id + '"' : ''));
        //                        }));
        //                    } else {
        //                        console.log('unknown highlight type for "' + (item.id || item) + '"');
        //                    }
        //                }
        //                if (hlVerificationsPromises.length > 0) {
        //                    $q.all(hlVerificationsPromises).then(function () {
        //                        if (hlVerifiedObjects.length > 0) {
        //                            var highlightsVerified = [];
        //                            for (hli = 0; hli < items.length; hli++) {
        //                                var item = items[hli];
        //                                //console.log('highlight.objectIds: '+item.objectIds);
        //                                for (vi = 0; vi < hlVerifiedObjects.length; vi++) {
        //                                    if (item.objectIds == hlVerifiedObjects[vi]) {
        //                                        item.title = item.name;
        //                                        item.abslink = '/app/page/highlights/' + item.objectIds.join(',');
        //                                        highlightsVerified.push(item);
        //                                        break;
        //                                    }
        //                                }
        //                            }
        //                            /*
        //                            for (var i = 0 ; i < items.length; i++) {
        //                              if (items[i].ref && !items[i].objectIds) {
        //                                highlightsVerified.push(items[i]);
        //                              }
        //                            }
        //                            */
        //                            $scope.highlights = highlightsVerified;
        //                            $ionicSlideBoxDelegate.update();
        //                        }
        //                    })
        //                } else if (highlights.length > 0) {
        //                    $scope.highlights = highlights;
        //                } else {
        //                    $scope.highlights = [defaultHighlight];
        //                }
        //            }
        //        }, function (menu) {
        //            console.log('error getting highligts from profile');
        //            $scope.highlights = [defaultHighlight];
        //        });
        //
        //        Config.navigationItems().then(function (items) {
        //            if (items) {
        //                if (items[items.length - 1] && items[items.length - 1].id != 'preferiti') {
        //                    // hardcoded favourites
        //                    items.push({
        //                        "id": "preferiti",
        //                        "name": {
        //                            "it": "PREFERITI",
        //                            "en": "FAVORITES",
        //                            "de": "LIEBLINGSSEITEN"
        //                        },
        //                        "description": null,
        //                        "image": null,
        //                        "objectIds": null,
        //                        "items": null,
        //                        "query": null,
        //                        "ref": "favorites",
        //                        "type": null,
        //                        "app": null
        //                    });
        //                }
        //                var rows = [],
        //                    row = -1,
        //                    pos = 0;
        //                for (ii = 0; ii < items.length; ii++) {
        //                    items[ii]['pos'] = pos;
        //                    if (Config.navItemMap()[items[ii].id]) {
        //                        items[ii].id = Config.navItemMap()[items[ii].id];
        //                    }
        //                    pos++;
        //                    if ((ii % 2) == 0) {
        //                        row++;
        //                        rows[row] = [];
        //                    }
        //                    rows[row].push(items[ii]);
        //                }
        //                $scope.buttonsRows = rows;
        //                $scope.topBoxStyle = {
        //                    bottom: (rows.length * 60) + 'px'
        //                };
        //            }
        //        }, function (menu) {
        //            $scope.buttonRows = null;
        //        });
        //
        //        Files.cleanup().then(function (data) {
        //            //console.log('files cleaned!');
        //        }, function () {
        //            console.log('files cleaning error!');
        //        });
    });

})
