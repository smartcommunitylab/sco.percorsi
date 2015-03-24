angular.module('roveretoPercorsi.controllers.categorie', [])

.controller('CategorieCtrl', function ($scope, $http) {

    $http.get('data/categorie.json').success(function (data) {
        $scope.categorie = data;
    });

})