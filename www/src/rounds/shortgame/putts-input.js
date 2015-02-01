statracker.directive('puttsInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/shortgame/putts-input.html',
            replace: true,
            scope: {
                shot: '='
            },
            link: function (scope, elem, attrs) {

                var putts = elem.find('circle');

                var clearPutts = function () {
                    angular.forEach(putts, function (p) {
                        var putt = angular.element(p);
                        if (!putt.hasClass('unselected')) putt.addClass('unselected');
                        if (putt.hasClass('selected')) putt.removeClass('selected');
                    });
                };

                var showPutt = function(value) {
                    angular.forEach(putts, function (p) {
                        var puttValue = parseInt(p.getAttribute(('data-value'))),
                            putt = angular.element(p);
                        if (puttValue === value) {
                            if (!putt.hasClass('selected')) putt.addClass('selected');
                            if (putt.hasClass('unselected')) putt.removeClass('unselected');
                        } else {
                            if (!putt.hasClass('unselected')) putt.addClass('unselected');
                            if (putt.hasClass('selected')) putt.removeClass('selected');
                        }
                    });
                };

                var bindValue = function () {
                    if (scope.shot && scope.shot.putts != null) {
                        showPutt(scope.shot.putts);
                    } else {
                        clearPutts();
                    }
                };

                bindValue();

                scope.$watch('shot', function () {
                    bindValue();
                });

                putts.bind('click', function () {
                    var value = parseInt(this.getAttribute(('data-value')));
                    scope.shot.putts = value;
                    bindValue();
                });
            }
        };
    }
]);