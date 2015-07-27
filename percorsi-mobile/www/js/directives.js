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
    })
    .directive('a', [
  function () {
            return {
                restrict: 'E',
                link: function (scope, element, attrs, ctrl) {
                    element.on('click', function (event) {
                        // process only non-angular links / links starting with hash
                        if (element[0].href && !element[0].attributes['ng-href'] && element[0].attributes['href'].value.indexOf('#') != 0) {
                            event.preventDefault();

                            var url = element[0].attributes['href'].value.replace(/“/gi, '').replace(/”/gi, '').replace(/"/gi, '').replace(/‘/gi, '').replace(/’/gi, '').replace(/'/gi, '');
                            console.log('url: <' + url + '>');
                            //var protocol = element[0].protocol;
                            //console.log('protocol: '+protocol);
                            //if (protocol && url.indexOf(protocol) == 0) {

                            // do not open broken/relative links
                            if (url.indexOf('http://') == 00 || url.indexOf('https://') == 0 || url.indexOf('mailto:') == 0 || url.indexOf('tel:') == 0 || url.indexOf('sms:') == 0) {
                                window.open(url, '_system');
                            } else {
                                console.log("blocking broken link: " + url);
                            }
                        }
                    });
                }
            };
}])
    .directive('compile', function ($compile) {
        // directive factory creates a link function
        return {
            scope: true,
            link: function (scope, element, attrs) {
                scope.COMPILED = true;
                scope.$watch(
                    function (scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        element.html(value);

                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(element.contents())(scope);
                    }
                );
            }
        };
    })
    .directive('coverImg', function () {
        return function (scope, element, attrs) {
            attrs.$observe('coverImg', function (value) {
                element.css({
                    'background-image': 'url(' + value + ')',
                    'background-size': 'cover'
                });
            });
        };
    })

.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="starType in stars track by $index" ng-click="toggle($index)">' +
            '<i class="icon vote-star" ng-class="{\'ion-android-star\': starType == \'full\', \'ion-android-star-half\': starType == \'half\', \'ion-android-star-outline\': starType == \'empty\'}"></i>' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&',
            getRating: '&'
        },
        link: function (scope, elem, attrs) {
            var updateStars = function () {
                scope.stars = scope.getRating();
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                /*if (newVal) {*/
                updateStars();
                /*}*/
            });
        }
    }
});
//    .directive('preventDrag', function ($ionicGesture, $ionicSlideBoxDelegate) {
//        return {
//            restrict: 'A',
//
//            link: function (scope, elem, attrs, e) {
//                var reportEvent = function (e) {
//
//                    if (e.target.tagName.toLowerCase() == 'div') {
//                        $ionicSlideBoxDelegate.enableSlide(false);
//                    } else {
//                        $ionicSlideBoxDelegate.enableSlide(true);
//                    }
//                };
//
//
//                $ionicGesture.on('drag', reportEvent, elem);
//            }
//        };
//    })
//;
