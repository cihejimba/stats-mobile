statracker.directive('attemptInput', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'src/rounds/shortgame/attempt-input.html',
            replace: true,
            scope: {
                flag: '=',
                round: '='
            },
            link: function (scope, elem) {

                var make = angular.element(elem[0].querySelector('#make')),
                    miss = angular.element(elem[0].querySelector('#miss'));

                var showUndefined = function () {
                    if (!make.hasClass('attempt-unselected')) make.addClass('attempt-unselected');
                    if (make.hasClass('attempt-selected-make')) make.removeClass('attempt-selected-make');
                    if (!miss.hasClass('attempt-unselected')) miss.addClass('attempt-unselected');
                    if (miss.hasClass('attempt-selected-miss')) miss.removeClass('attempt-selected-miss');
                };

                var showTrue = function() {
                    if (make.hasClass('attempt-unselected')) make.removeClass('attempt-unselected');
                    if (!make.hasClass('attempt-selected-make')) make.addClass('attempt-selected-make');
                    if (!miss.hasClass('attempt-unselected')) miss.addClass('attempt-unselected');
                    if (miss.hasClass('attempt-selected-miss')) miss.removeClass('attempt-selected-miss');
                };

                var showFalse = function () {
                    if (!make.hasClass('attempt-unselected')) make.addClass('attempt-unselected');
                    if (make.hasClass('attempt-selected-make')) make.removeClass('attempt-selected-make');
                    if (miss.hasClass('attempt-unselected')) miss.removeClass('attempt-unselected');
                    if (!miss.hasClass('attempt-selected-miss')) miss.addClass('attempt-selected-miss');
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
                    if (scope.round && scope.round.isComplete) return;
                    if (!scope.flag) {
                        scope.flag = true;
                        showTrue();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                });

                miss.bind('click', function () {
                    if (scope.round && scope.round.isComplete) return;
                    if (scope.flag === undefined || scope.flag === true) {
                        scope.flag = false;
                        showFalse();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                });
            }
        };
    }
]);