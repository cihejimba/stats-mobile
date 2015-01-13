statracker.controller('ListRoundsController', [
    'roundService',
    function (roundService) {

        this.rounds = [];

        roundService.getAll().then(function (response) {
           this.rounds = response.data;
        });
    }
]);
