statracker.controller('ListRoundsController', [
    '$state',
    '$scope',
    'roundService',
    function ($state, $scope, roundService) {

        var vm = this;

        vm.rounds = [];
        vm.scores = {};
        vm.filter = {
            holes: 18,
            roundsToChart: 10,
            monthsToList: 3
        };

        $scope.$watch(angular.bind(vm, function (filter) {
            return vm.filter.holes;
        }), function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                vm.calculateRecentScores(vm.filter.roundsToChart, vm.filter.holes);
            }
        });

        roundService.getAll().then(function (response) {
            vm.rounds = response.data;
            vm.calculateRecentScores(vm.filter.roundsToChart, vm.filter.holes);
        });

        vm.calculateRecentScores = function (numberOfRounds, holes) {
            var data = {},
                total = 0;

            if (holes === 9) {
                data.key = 'Recent 9 hole rounds';
            } else {
                data.key = 'Recent 18 hole rounds';
            }
            data.values = vm.getRecentScores(vm.rounds, holes, numberOfRounds);

            total = data.values.reduce(function (prev, curr) {
                return {value: prev.value + curr.value};
            }, {value: 0});

            vm.scores.average = total.value / data.values.length;
            vm.scores.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 160,
                    title: {
                        enable: true,
                        text: 'Recent Scores'
                    },
                    margin : {
                        top: 20,
                        right: 10,
                        bottom: 10,
                        left: 10
                    },
                    color: ['#88A65E'],
                    x: function(d){ return d.label; },
                    y: function(d){ return d.value; },
                    showValues: true,
                    showYAxis: false,
                    showXAxis: false,
                    valueFormat: function(d){
                        return d3.format('d')(d);
                    },
                    transitionDuration: 500,
                    discretebar: {
                        dispatch: {
                            elementClick: function (e) {
                                vm.gotoSummary(e.point.label);
                            }
                        }
                    }
                }
            };

            vm.scores.data = [data];
        };

        vm.gotoSummary = function (roundId) {
            roundService.loadRound(roundId).then(function () {
                $state.go('tab.round-summary');
            });
        };

        vm.getRecentScores = function (rounds, holes, num) {
            var i, latest, recent = [];

            latest = rounds.filter(function (round) {
                return round.holes === holes && round.score > 0;
            });

            for (i = 0; i < num && i < latest.length; i++) {
                recent.push({
                    label: latest[i].key,
                    value: latest[i].score
                });
            }
            return recent;
        };
    }
]);
