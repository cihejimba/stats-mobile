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
                    miss = angular.element(elem[0].querySelector('#miss')),
                    makeLines = make.find('line'),
                    makeCircle = make.find('circle'),
                    missLines = miss.find('line'),
                    missCircle = miss.find('circle');

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

                var handleMakeClick = function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    e.stopPropagation();
                    console.debug('make click');
                    if (!scope.flag) {
                        scope.flag = true;
                        showTrue();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                };

                var handleMissClick = function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    e.stopPropagation();
                    console.debug('miss click');
                    if (scope.flag === undefined || scope.flag === true) {
                        scope.flag = false;
                        showFalse();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                };

                scope.$watch('flag', function () {
                    bindValue();
                });

                make.bind('click', handleMakeClick);
                makeLines.bind('click', handleMakeClick);
                makeCircle.bind('click', handleMakeClick);

                miss.bind('click', handleMissClick);
                missLines.bind('click', handleMissClick);
                missCircle.bind('click', handleMissClick);
            }
        };
    }
]);