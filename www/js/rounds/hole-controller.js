'use strict';

angular.module('statracker').controller('HoleController', [
    '$scope',
    '$state',
    function ($scope, $state) {

        if (!$scope.round) {
            $scope.round = {};
        }
        $scope.round.id = $state.params.id;

        if (!$scope.hole) {
            $scope.hole = {};
        }
        $scope.hole.number = $state.params.hole;

        $scope.gotoSummary = function () {
            var params = $state.params;
            params.hole = undefined;
            $state.go('^.round-summary', params);
        };
    }
]);