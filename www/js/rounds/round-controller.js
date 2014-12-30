angular.module('statracker').controller('RoundController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        'use strict';

        if (!$scope.round) {
            $scope.round = {};
        }
        $scope.round.id = $state.params.id;

        $scope.gotoDetails = function () {
            var params = $state.params;
            params.hole = 1;
            $state.go('^.round-detail-teeball', params);
        };
    }
]);
