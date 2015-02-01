statracker.controller('ShortGameController', [
    '$state',
    '$scope',
    'roundService',
    function ($state, $scope, roundService) {

        var vm = this;

        //vm.round = roundService.getCurrentRound();
        //vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.shortGameShots[hole - 1];
            });
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.round = roundService.getCurrentRound();
            vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });
    }
]);
