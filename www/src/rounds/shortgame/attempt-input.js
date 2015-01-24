statracker.directive('attemptInput', [
    '$parse',
    function ($parse) {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/shortgame/attempt-input.html',
            replace: true,
            require: 'ngModel',
            link: function (scope, element, attributes, controller) {

                var make = angular.element(document.querySelector('#make')),
                    miss = angular.element(document.querySelector('#miss')),
                    initialValue = $parse(attributes.ngModel)(scope);

                var showUndefined = function () {
                    if (!make.hasClass('unselected')) make.addClass('unselected');
                    if (!miss.hasClass('unselected')) miss.addClass('unselected');
                };

                var showTrue = function() {
                    if (make.hasClass('unselected')) make.removeClass('unselected');
                    if (!miss.hasClass('unselected')) miss.addClass('unselected');
                };

                var showFalse = function () {
                    if (!make.hasClass('unselected')) make.addClass('unselected');
                    if (miss.hasClass('unselected')) miss.removeClass('unselected');
                };

                if (initialValue === true) {
                    showTrue();
                } else if (initialValue === false) {
                    showFalse();
                } else {
                    showUndefined();
                }

                make.bind('click', function () {
                    if (!controller.$viewValue) {
                        controller.$setViewValue(true);
                        showTrue();
                    } else {
                        controller.$setViewValue(undefined);
                        showUndefined();
                    }
                    scope.$apply();
                });

                miss.bind('click', function () {
                    if (controller.$viewValue === undefined || controller.$viewValue === true) {
                        controller.$setViewValue(false);
                        showFalse();
                    } else {
                        controller.$setViewValue(undefined);
                        showUndefined();
                    }
                    scope.$apply();
                });
            }
        };
    }
]);