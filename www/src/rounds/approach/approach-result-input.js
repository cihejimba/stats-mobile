statracker.directive('approachResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/approach/approach-result-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem) {

                var green = elem.find('path'),
                    svg = elem[0].querySelector('svg'),
                    xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var point = svg.createSVGPoint();

                var cursorPoint = function (evt) {
                    point.x = evt.clientX;
                    point.y = evt.clientY;
                    return point.matrixTransform(svg.getScreenCTM().inverse());
                };

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        console.warn('x or y is null');
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

                scope.$watch('shot', function () {
                    console.debug('shot watch');
                    if (scope.shot) {
                        console.debug('shot exists');
                        clearBalls();
                        if (scope.shot.result != null && scope.shot.result >= 0) {
                            placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                        }
                    }
                });

                green.bind('click', function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    console.debug('green click at ' + scope.shot.result);
                    scope.$emit('stk.approach', scope.shot.getResultText());
                    if (!scope.shot.coordinates) {
                        scope.shot.coordinates = {x:0,y:0};
                    }
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    placeBall(cp.x, cp.y, true);
                });
            }
        };
    }
]);
