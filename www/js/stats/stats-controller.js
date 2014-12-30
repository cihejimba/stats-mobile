angular.module('statracker').controller('StatsController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        'use strict';

        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);