statracker.controller('CreateRoundController', [
    '$scope',
    '$state',
    'userDataService',
    'roundService',
    'userData',
    function ($scope, $state, userDataService, roundService, userData) {

        var vm = this;

        vm.courses = userData.courses;

        vm.round = {
            date: new Date(),
            holes: 18,
            course: { key: 0, courseDescription: '' },
            hasError: false,
            error: ''
        };

        vm.canStart = function () {
            return true;
        };

        vm.startRound = function () {
            var newRound = roundService.create(vm.round.course, vm.round.date, vm.round.holes);
            roundService.update(newRound, true).then(function (r) {
                $state.go('^.round-detail-teeball({id: ' + r.key + ', hole: 1})');
            });
        };

        $scope.$on('new-course', function (e, courseName) {
            userDataService.addCourse(courseName).then(function (data) {
                if (data) {
                    vm.round.course.key = data.key;
                }
            });
        });
    }
]);
