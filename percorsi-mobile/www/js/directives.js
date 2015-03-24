angular.module('roveretoPercorsi.directives', [])

.directive('backImg', function () {
    return function (scope, element, attrs) {
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background-image': 'url(' + url + ')',
            'background-size': 'cover'
        });
    };
});
