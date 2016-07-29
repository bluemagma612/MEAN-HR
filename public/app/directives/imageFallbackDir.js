//*** Directives ***
angular.module('imageFallbackDir', [])
//if theres no image for the employee, use a default anonymous image
.directive('imageFallback', function() {
    return {
        link: function(scope, elem, attrs) {
            elem.bind('error', function() {
                angular.element(this).attr('src', attrs.imageFallback);
            });
        }
    };
});