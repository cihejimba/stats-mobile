statracker.directive('navNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var destination = attrs.navNext;
                $ionicGesture.on('swipe', function(event) {
                    if (event.gesture.direction === 'left') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('forward');
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);
