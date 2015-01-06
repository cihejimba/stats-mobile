'use strict';

angular.module('statracker').controller('StatsController', [
    '$scope',
    '$state',
    function ($state) {
        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);