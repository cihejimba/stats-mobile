statracker.controller('ListRoundsController', [
    'roundService',
    function (roundService) {

        var vm = this;

        vm.rounds = [];

        roundService.getAll().then(function (response) {
            vm.rounds = response.data;
        });
    }
]);
