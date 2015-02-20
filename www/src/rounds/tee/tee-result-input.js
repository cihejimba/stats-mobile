statracker.directive('teeResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/tee/tee-result-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem, attrs) {

                var fairway = elem.find('rect'),
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
                        var i, balls = shots.children;
                        for(i = 0; i < balls.length; i++) {
                            shots.removeChild(balls[i]);
                        }
                    }
                };

                var calculateDistance = function (resultId) {
                    var distanceKey = Math.floor(resultId / 10) - 1,
                        baseDistance = 200;
                    return baseDistance + (5 * distanceKey);
                };

                var calculateCoordinates = function (distance) {
                    var x = scope.shot.coordinates && scope.shot.coordinates.x ? scope.shot.coordinates.x : 170;
                    var y = 372 - ((distance - 200) * 2.4);
                    return {
                        x: x,
                        y: y
                    };
                };

                //TODO: this should be a one-time thing - how to ensure that?
                scope.$watch('shot', function () {
                    if (scope.shot) {
                        clearBalls();
                        if (scope.shot.result != null && scope.shot.result >= 0) {
                            placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                        }
                    }
                });

                scope.$watch('shot.distance', function (newValue, oldValue) {
                    if (newValue === undefined || newValue === oldValue) return;
                    if (Number(newValue) > 200) {
                        scope.shot.coordinates = calculateCoordinates(Number(newValue));
                        placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                    }
                });

                fairway.bind('click', function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    if (!scope.shot.coordinates) {
                        scope.shot.coordinates = {x:0,y:0};
                    }
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    scope.$emit('tee_shot_distance', calculateDistance(scope.shot.result));
                    placeBall(cp.x, cp.y, true);
                });
            }
        };
    }
]);
