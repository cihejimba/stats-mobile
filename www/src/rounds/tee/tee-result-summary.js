statracker.directive('teeResultSummary', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/tee/tee-result-input.html',
            replace: true,
            scope: {
                round: '='
            },
            link: function (scope, elem) {

                var xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        //log warning
                        return;
                    }
                    var use = document.createElementNS(xmlns, 'use'),
                        transform = 'translate(' + x + ',' + y + ') scale(1.0)';

                    if (clear) {
                        clearBalls();
                    }

                    use.setAttributeNS(xlinkns, 'xlink:href', '#ball');
                    use.setAttributeNS(null, 'transform', transform);
                    shots.appendChild(use);
                };

                var clearBalls = function () {
                    if (shots.hasChildNodes()) {
                        while(shots.firstChild) {
                            shots.removeChild(shots.firstChild);
                        }
                    }
                };

                scope.$watch('round', function () {
                    if (scope.round && scope.round.teeShots) {
                        clearBalls();
                        scope.round.teeShots.forEach(function (shot) {
                            if (shot.coordinates != null) {
                                placeBall(shot.coordinates.x, shot.coordinates.y, false);
                            }
                        });
                    }
                });
            }
        };
    }
]);
