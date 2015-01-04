angular.module('statracker').directive('compareTo', [
    function () {
        'use strict';

        return {
            require: 'ngModel',
            scope: {
                otherValue: '=compareTo'
            },
            link: function(scope, elem, attrs, ctrl) {
                ctrl.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherValue;
                };
                scope.$watch("otherValue", function() {
                    ctrl.$validate();
                });
            }
        }
    }
]);