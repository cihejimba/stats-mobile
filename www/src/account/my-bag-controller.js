statracker.controller('MyBagController', [
    '$scope',
    '$ionicModal',
    'userDataService',
    'userData',
    function ($scope, $ionicModal, userDataService, userData) {

        var vm = this;

        vm.clubs = userData.clubs;
        vm.showDelete = false;

        userDataService.getDefaultClubs().then(function (clubs) {
            $scope.clubs = clubs;
            $ionicModal.fromTemplateUrl('src/account/edit-club-modal.html', {
                scope: $scope
            }).then(function (modal) {
                vm.modal = modal;
            });
        });

        $scope.cancel = function () {
            vm.modal.hide();
        };

        $scope.save = function () {
            vm.modal.hide();
            var club = $scope.currentClub;
            if ($scope.inEditMode) {
                userDataService.updateClub(club);
            } else {
                var selectedClub = $scope.clubs.find(function (c) {
                    return c.key === club.clubKey;
                });
                club.club.key = selectedClub.key;
                club.club.clubName = selectedClub.name;
                userDataService.addClub(club).then(function (clubs) {
                    vm.clubs = clubs;
                });
            }
        };

        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });

        vm.editClub = function (club) {
            $scope.inEditMode = true;
            if (!club) {
                club = {
                    key: 0,
                    club: {
                        key: -1,
                        clubName: ''
                    },
                    teeballFlag: false,
                    approachFlag: false,
                    sortOrderNumber: 99
                };
                $scope.inEditMode = false;
            }
            $scope.currentClub = club;
            vm.modal.show();
        };

        vm.deleteClub = function (club) {
            userDataService.removeClub(club).then(function (clubs) {
                vm.clubs = clubs;
            });
        };
    }
]);