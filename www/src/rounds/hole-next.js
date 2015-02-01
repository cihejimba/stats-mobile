statracker.directive('holeNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    'roundService',
    function ($state, $ionicGesture, $ionicViewSwitcher, roundService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                var destination = attrs.holeNext;

                $ionicGesture.on('swipe', function(event) {

                    if (event.gesture.direction === 'left') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('forward');

                        if ($state.is('tab.round-detail-shortgame'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            var round = roundService.getCurrentRound(),
                                hole = roundService.getCurrentHole();
                            if (hole == round.holes) { // jshint ignore:line
                                roundService.setCurrentHole(1);
                            } else {
                                roundService.setCurrentHole(hole + 1);
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);
