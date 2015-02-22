statracker.controller('RoundSummaryController', [
    'roundService',
    '$state',
    '$scope',
    'toaster',
    '$ionicPopup',
    function (roundService, $state, $scope, toaster, $ionicPopup) {

        var vm = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.stats = vm.round.calculateStats();
            },
            function () {
                toaster.toastError('Failed to get the current round');
                $state.go('^.rounds');
            });
        });

        vm.deleteRound = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Round',
                template: 'Are you sure you want to permanently delete this round?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    roundService.delete(vm.round.key).then(function () {
                        toaster.toastSuccess('Your round has been deleted').then(function () {
                            $state.go('^.rounds');
                        });
                    });
                }
            });
        };

        vm.saveRound = function (completed) {
            vm.round.isComplete = completed;
            roundService.complete(vm.round).then(function () {
                toaster.toastSuccess('Your round has been saved');
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
