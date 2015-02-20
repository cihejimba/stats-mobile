statracker.controller('CourseListController', [
    'userDataService',
    'userData',
    function (userDataService, userData) {

        var vm = this;

        vm.courses = userData.courses;
        vm.showDelete = false;

        vm.deleteCourse = function (course) {
            //TODO: get confirmation
            //TODO: detect and handle case where course is tied to a round
            userDataService.deleteCourse(course).then(function (newCourseList) {
                vm.courses = newCourseList;
                vm.showDelete = false;
            });
        };
    }
]);