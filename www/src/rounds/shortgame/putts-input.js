statracker.directive('puttsInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/shortgame/putts-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem) {

                var putts = elem.find('circle'),
                    puttsText = elem.find('text');

                var clearPutts = function () {
                    angular.forEach(putts, function (p) {
                        var putt = angular.element(p);
                        if (!putt.hasClass('putt-unselected')) putt.addClass('putt-unselected');
                        if (putt.hasClass('putt-selected')) putt.removeClass('putt-selected');
                    });
                    angular.forEach(puttsText, function (txt) {
                        var puttText = angular.element(txt);
                        if (!puttText.hasClass('putt-unselected')) puttText.addClass('putt-unselected');
                        if (puttText.hasClass('putt-selected')) puttText.removeClass('putt-selected');
                    });
                };

                var showPutt = function(value) {
                    angular.forEach(putts, function (p) {
                        var puttValue = parseInt(p.getAttribute(('data-value'))),
                            putt = angular.element(p);
                        if (puttValue === value) {
                            if (!putt.hasClass('putt-selected')) putt.addClass('putt-selected');
                            if (putt.hasClass('putt-unselected')) putt.removeClass('putt-unselected');
                        } else {
                            if (!putt.hasClass('putt-unselected')) putt.addClass('putt-unselected');
                            if (putt.hasClass('putt-selected')) putt.removeClass('putt-selected');
                        }
                    });
                    angular.forEach(puttsText, function (txt) {
                        var puttTextValue = parseInt(txt.textContent),
                            puttText = angular.element(txt);
                        if (puttTextValue === value) {
                            if (!puttText.hasClass('putt-selected')) puttText.addClass('putt-selected');
                            if (puttText.hasClass('putt-unselected')) puttText.removeClass('putt-unselected');
                        } else {
                            if (!puttText.hasClass('putt-unselected')) puttText.addClass('putt-unselected');
                            if (puttText.hasClass('putt-selected')) puttText.removeClass('putt-selected');
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

                scope.$watch('shot.putts', function (nv, ov) {
                    if (nv) {
                        bindValue();
                    } else {
                        clearPutts();
                    }
                });

                putts.bind('click', function () {
                    if (scope.round && scope.round.isComplete) return;
                    var value = parseInt(this.getAttribute(('data-value')));
                    scope.shot.putts = value;
                    bindValue();
                });

                puttsText.bind('click', function () {
                    if (scope.round && scope.round.isComplete) return;
                    var value = parseInt(this.textContent);
                    scope.shot.putts = value;
                    bindValue();
                });
            }
        };
    }
]);