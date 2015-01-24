statracker.controller('ShortGameController', [
    '$state',
    'roundService',
    function ($state, roundService) {

        var vm = this;

        if (!vm.round) {
            vm.round = roundService.getCurrent($state.params.id);
        }

        if (!vm.shot) {
            vm.shot = vm.round.approachShots[$state.params.hole - 1];
        }

        vm.gotoSummary = function () {
            var params = $state.params;
            params.hole = undefined;
            $state.go('^.round-summary', params);
        };
    }
]);
