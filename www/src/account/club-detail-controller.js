statracker.controller('ClubDetailController', [
    '$state',
    '$scope',
    'userDataService',
    function ($state, $scope, userDataService) {

        var vm = this;

        userDataService.getDefaultClubs().then(function (clubs) {
            vm.clubs = clubs;
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.userClub = $state.params.club;
        });

        vm.saveClub = function () {
            if (!vm.userClub.key) {
                //the club child object is not populated by our api call
                var club = vm.clubs.find(function (c) {
                    return c.key === vm.userClub.clubKey;
                });
                vm.userClub.key = 0;
                vm.userClub.club = {
                    key: club.key,
                    clubName: club.name
                };
                userDataService.addClub(vm.userClub).then(function () {
                    $state.go('^.my-bag');
                });
            } else {
                userDataService.updateClub(vm.userClub).then(function () {
                    $state.go('^.my-bag');
                });
            }
        };
    }
]);