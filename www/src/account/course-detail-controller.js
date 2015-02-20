statracker.controller('CourseDetailController', [
    '$state',
    '$scope',
    'userDataService',
    function ($state, $scope, userDataService) {

        var vm = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            userDataService.getCourse( $state.params.key).then(function (response) {
                vm.course = response.data;
            });
        });

        vm.saveCourse = function () {
            if (!vm.course.key) {
                vm.course.key = 0;
                userDataService.createCourse(vm.course).then(function () {
                    $state.go('^.course-list');
                });
            } else {
                userDataService.updateCourse(vm.course).then(function () {
                    $state.go('^.course-list');
                });
            }
        };
    }
]);
