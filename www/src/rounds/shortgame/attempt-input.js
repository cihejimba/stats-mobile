statracker.directive('attemptInput', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'src/rounds/shortgame/attempt-input.html',
            replace: true,
            scope: {
                flag: '='
            },
            link: function (scope, elem, attrs) {

                var make = angular.element(elem[0].querySelector('#make')),
                    miss = angular.element(elem[0].querySelector('#miss'));

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

                var bindValue = function () {
                    if (scope.flag === true) {
                        showTrue();
                    } else if (scope.flag === false) {
                        showFalse();
                    } else {
                        showUndefined();
                    }
                };

                bindValue();

                scope.$watch('flag', function () {
                    bindValue();
                });

                make.bind('click', function () {
                    if (scope.flag === undefined) {
                        scope.flag = true;
                        showTrue();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                    //scope.$apply();
                });

                miss.bind('click', function () {
                    if (scope.flag === undefined || scope.flag === true) {
                        scope.flag = false;
                        showFalse();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                    //scope.$apply();
                });
            }
        };
    }
]);