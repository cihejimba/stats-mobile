statracker.controller('RoundSummaryController', [
    'roundService',
    '$state',
    '$scope',
    'toaster',
    function (roundService, $state, $scope, toaster) {

        var vm = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.stats = vm.round.calculateStats();
            },
            function () {
                console.log('failed to get the current round - redirecting to rounds list');
                $state.go('^.rounds');
            });
        });

        vm.saveRound = function (completed) {
            var isComplete = vm.round.isComplete;
            vm.round.isComplete = completed;
            roundService.complete(vm.round).then(function () {
                toaster.toastSuccess('the round has been saved');
            },
            function (error) {
                toaster.toastError('failure: ' + error);
                vm.round.isComplete = isComplete;
            });
        };

        vm.deleteRound = function () {
            roundService.delete(vm.round.key).then(function () {
                    toaster.toastSuccess('the round has been deleted').then(function () {
                    $state.go('^.rounds');
                });
            },
            function (error) {
                toaster.toastError('failure: ' + error);
            });
        };

        vm.gotoDetails = function () {
            roundService.setCurrentHole(1);
            $state.go('^.round-detail-teeball');
        };

        vm.isComplete = function () {
            return vm.round && vm.round.isComplete;
        };

        vm.hasDrivingStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            var hasStats = vm.round &&
                vm.round.teeShots.some(function (shot) {
                    return shot.coordinates && shot.coordinates.x !== null;
                });
            return hasStats;
        };

        vm.hasApproachStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            var hasStats = vm.round &&
                vm.round.approachShots.some(function (shot) {
                    return shot.coordinates && shot.coordinates.x !== null;
                });
            return hasStats;
        };

        vm.hasShortgameStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            return vm.stats && vm.stats.putting && vm.stats.putting.putts > 0;
        };
    }
]);
