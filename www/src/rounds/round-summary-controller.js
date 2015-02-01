statracker.controller('RoundSummaryController', [
    'roundService',
    '$state',
    function (roundService, $state) {

        var vm = this;

        vm.round = roundService.getCurrentRound();

        vm.gotoDetails = function () {
            var params = $state.params;
            params.hole = 1;
            $state.go('^.round-detail-teeball', params);
        };
    }
]);
