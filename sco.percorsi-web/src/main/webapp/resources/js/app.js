var consoleApp = angular.module('console', ['ui.bootstrap',
'ui.router',
'ui.sortable',
'consoleControllers.mainCtrl',
'consoleControllers.paths',
'consoleControllers.poi',
'consoleControllers.categories',
'DataService',
'MapsService',
'ImgurService',
'ngUpload',
'checklist-model',
'textAngular',
'naif.base64',
'angular-loading-bar'
]);

consoleApp.run(['$rootScope', '$q', '$modal', '$location', 'DataService',
  function ($localize, $rootScope, $q, $modal, $location, DataService, CodeProcessor, ValidationService) {
        $rootScope.logout = function (url) {
            DataService.logout().then(function () {
                window.location.reload();
            });
        };
  }]);

// Text editor toolbar config
consoleApp.config(['$provide', function ($provide) {
    $provide.decorator('taOptions', ['$delegate', function (taOptions) {
        taOptions.toolbar = [
                      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo'],
                      ['html', 'insertImage', 'insertLink', 'insertVideo', 'indent', 'outdent'],
                      ['wordcount', 'charcount']
                  ];
        return taOptions;
    }]);
}])


consoleApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/paths-list');
    $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            templateUrl: 'templates/header.html',
            controller: 'MainCtrl'
        })
        .state('root.paths-list', {
            url: '/paths-list',
            templateUrl: 'templates/paths/paths-list.html',
            controller: 'PathsCtrl'
        })
        .state('root.path', {
            url: '/path/:idPath',
            templateUrl: 'templates/paths/path.html',
            controller: 'PathCtrl'
        })
        .state('root.poi', {
            url: '/poi/:idPoi',
            templateUrl: 'templates/pois/poi.html',
            controller: 'PoiCtrl'
        })
        // Categories
        .state('root.categories-list', {
            url: '/categories-list',
            templateUrl: 'templates/categories/categories-list.html',
            controller: 'CategoriesCtrl'
        })
        .state('root.category', {
            url: '/category/:idCat',
            templateUrl: 'templates/categories/category.html',
            controller: 'CategoryCtrl'
        })
        // Moderation
        .state('root.moderate', {
            url: '/moderate',
            templateUrl: 'templates/moderate.html'
        });
})

// Accordion reorder (probalby removing it)
consoleApp.config(['$provide', function ($provide) {
    $provide.decorator('accordionDirective', function ($delegate) {
        var directive = $delegate[0];
        directive.replace = true;
        return $delegate;
    });
}]);