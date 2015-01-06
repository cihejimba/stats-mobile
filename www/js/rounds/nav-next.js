angular.module('statracker').directive('navNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        'use strict';

        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var destination = attrs.navNext;
                $ionicGesture.on('swipe', function(event) {
                    if (event.gesture.direction === 'left') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('forward');
                        //very specific to hole by hole navigation
                        if ($state.is('tab.round-detail-shortgame'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            if ($state.params.hole !== undefined && $state.params.hole == 3) { // jshint ignore:line
                                $state.params.hole = 1;
                            } else {
                                $state.params.hole += 1;
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);
