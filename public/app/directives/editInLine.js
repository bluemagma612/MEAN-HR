/**
 * Created by Bluemagma on 7/25/16.
 */
app.directive('editInLine', function($compile) {
    var exports = {};

    function link (scope, element, attrs) {
        var template = '<div class="in-line-container">';
        var newElement;
        var displayValue;
        var options;

        switch (attrs.editType) {
            case 'select':
                displayValue = attrs.displayValue ? 'displayValue' : 'value';
                options = attrs.editOption;
                options = options.replace(attrs.editList, 'editList');

                template += '<div class="in-line-value" ng-hide="editing">' +
                    '{{'+displayValue+'}}</div>';
                template += '<select class="in-line-input form-control" ng-show="editing"' +
                    'ng-model="value" ng-options="' +options+'"></select>';
                break;

            case 'number':
                template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
                template += '<input class="in-line-input form-control" ng-show="editing"' +
                    'type="number" ng-model="value" step="any" min="0" max="99999" />';
                break;

            default:
                template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
                template += '<input class="in-line-input form-control" ng-show="editing"' +
                    'type="text" ng-model="value" />';
        }

        //Close the outer div
        template += '</div>';
        newElement = $compile(template)(scope);
        element.replaceWith(newElement);

        scope.$on('$destroy', function() {
            newElement = undefined;
            element = undefined;
        });
    }

    exports.scope = {
        value: '=',
        editing: '=',
        editList: '=',
        displayValue: '='
    };

    exports.restrict = 'E';
    exports.link = link;

    return exports;
});