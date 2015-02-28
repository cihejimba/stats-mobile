statracker.controller('ShortGameController', [
    '$state',
    '$scope',
    'roundService',
    function ($state, $scope, roundService) {

        var vm = this;

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
            roundService.getCurrentRound().then(function (round) {
                    vm.round = round;
                    vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];
                },
                function () {
                    console.log('failed to get the current round - redirecting to rounds list');
                    $state.go('^.rounds');
                });
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round, false); //true: doSynch with server
        });
    }
]);
