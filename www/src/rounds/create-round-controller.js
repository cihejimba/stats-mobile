statracker.controller('CreateRoundController', [
    '$scope',
    '$state',
    'userDataService',
    'roundService',
    'userData',
    '$ionicModal',
    function ($scope, $state, userDataService, roundService, userData, $ionicModal) {

        var vm = this;

        vm.courses = userData.courses;

        vm.canStart = function () {
            return true;
        };

        vm.startRound = function () {
            var selectedCourse = vm.courses.find(function (c) {
                return c.key === vm.round.courseKey;
            });
            var newRound = roundService.create(selectedCourse, vm.round.date, vm.round.holes);
            roundService.update(newRound, true).then(function () {
                $state.go('^.round-detail-teeball');
            });
        };

        vm.courseSelected = function () {
            var selected = vm.courses.find(function (c) {
                return c.key === vm.round.courseKey;
            });
            if (selected) {
                vm.round.holes = selected.holes;
            }
        };

        vm.getNewCourse = function() {
            vm.modal.show();
        };

        vm.newCourse = function () {
            userDataService.addCourse($scope.course).then(function (data) {
                if (data) {
                    vm.round.courseKey = data.key;
                    vm.round.holes = data.holesNumber;
                }
            });
            vm.modal.hide();
        };

        vm.hideModal = function () {
            vm.modal.hide();
        };

        $ionicModal.fromTemplateUrl('src/rounds/new-course-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            vm.modal = modal;
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.round = {
                date: new Date(),
                holes: 18,
                courseKey: 0,
                isTournament: false,
                hasError: false,
                error: ''
            };
            $scope.course = {
                holes: 18,
                course: '',
                tees: '',
                par: 72
            };
        });

        $scope.$watch('course.holes', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                if (newValue === 18) {
                    $scope.course.par = 72;
                } else {
                    $scope.course.par = 36;
                }
            }
        });

        $scope.$on('$destroy', function() {
            vm.modal.remove();
        });
    }
]);
