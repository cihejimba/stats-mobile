statracker.controller('ApproachShotController', [
    '$state',
    '$scope',
    'roundService',
    'userData',
    function ($state, $scope, roundService, userData) {

        var vm = this;

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.approachShots[hole - 1];
                vm.shotDescription = vm.shot.getResultText();
            });
        });

        $scope.$on('$ionicView.loaded', function () {
            vm.clubs = userData.clubs.reduce(function(memo, club) {
                if (club.approachFlag) { // filter
                    memo.push({ // map
                        key: club.clubKey,
                        name: club.club.clubName
                    });
                }
                return memo;
            }, []);
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.shot = vm.round.approachShots[roundService.getCurrentHole() - 1];
                vm.shotDescription = vm.shot.getResultText();
            });
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });

        $scope.$on('stk.approach', function (e, result) {
            vm.shotDescription = result;
            $scope.$apply();
        });
    }
]);