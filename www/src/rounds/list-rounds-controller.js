statracker.controller('ListRoundsController', [
    '$state',
    'roundService',
    function ($state, roundService) {

        var vm = this;

        vm.rounds = [];

        roundService.getAll().then(function (response) {
            vm.rounds = response.data;
        });
    }
]);
