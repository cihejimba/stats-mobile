statracker.controller('MyBagController', [
    '$scope',
    'userDataService',
    'userData',
    function ($scope, userDataService, userData) {

        var vm = this;

        vm.showDelete = false;

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.userClubs = userData.clubs;
        });

        vm.deleteClub = function (club) {
            userDataService.removeClub(club).then(function (clubs) {
                vm.userClubs = clubs;
                vm.showDelete = false;
            });
        };
    }
]);