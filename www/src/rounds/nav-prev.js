statracker.directive('navPrev', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var destination = attrs.navPrev;
                $ionicGesture.on('swipe', function(event) {
                    if (event.gesture.direction === 'right') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('back');
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);
