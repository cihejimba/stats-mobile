statracker.directive('approachResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/approach/approach-result-input.html',
            replace: true,
            scope: {
                shot: '='
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
                        //log warning
                        return
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
                        var i, balls = shots.children;
                        for(i = 0; i < balls.length; i++) {
                            shots.removeChild(balls[i]);
                        }
                    }
                };

                scope.$watch('shot', function () {
                    clearBalls();
                    if (scope.shot.result != null && scope.shot.result >= 0) {
                        //scope.resultText = scope.shot.getResultText();
                        placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                    }
                });

                green.bind('click', function (e) {
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    placeBall(cp.x, cp.y, true);
                });
            }
        };
    }
]);
