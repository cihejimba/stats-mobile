statracker.controller('CreateRoundController', [
    '$state',
    'userData',
    'roundService',
    function ($state, userData, roundService) {

        this.round = {
            date: Date.now(),
            holes: 18,
            course: {},
            hasError: false,
            error: ''
        };

        this.canStart = function () {
            return true;
        };

        this.startRound = function () {
            var newRound = roundService.create(this.round.course, this.round.date, this.round.holes);
            roundService.update(newRound, true).then(function (r) {
                $state.go('^.round-detail-teeball({id: ' + r.key + ', hole: 1})');
            });
        };
    }
]);
