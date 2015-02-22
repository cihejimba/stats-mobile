statracker.directive('holePrev', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    'roundService',
    function ($state, $ionicGesture, $ionicViewSwitcher, roundService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                var destination = attrs.holePrev;

                $ionicGesture.on('swipe', function(event) {

                    if (event.gesture.direction === 'right') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('back');

                        if ($state.is('tab.round-detail-teeball'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            roundService.getCurrentRound().then(function (round) {
                                var hole = roundService.getCurrentHole();
                                if (hole == 1) { // jshint ignore:line
                                    roundService.setCurrentHole(round.holes);
                                } else {
                                    roundService.setCurrentHole(hole - 1);
                                }
                            });
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);