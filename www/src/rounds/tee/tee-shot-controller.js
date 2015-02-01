statracker.controller('TeeShotController', [
    '$state',
    '$scope',
    'roundService',
    'userData',
    function ($state, $scope, roundService, userData) {

        var vm = this;

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('tee_shot_distance', function (e, distance) {
            vm.shot.distance = distance;
            $scope.$apply();
        });

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.teeShots[hole - 1];
            });
        });

        $scope.$on('$ionicView.loaded', function () {
            vm.clubs = userData.clubs.reduce(function(memo, club) {
                if (club.teeballFlag) { // filter
                    memo.push({ // map
                        key: club.clubKey,
                        name: club.club.clubName
                    });
                }
                return memo;
            }, []);
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.round = roundService.getCurrentRound();
            vm.shot = vm.round.teeShots[roundService.getCurrentHole() - 1];
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });
    }
]);
