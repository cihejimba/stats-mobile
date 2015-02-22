statracker.controller('CourseListController', [
    '$ionicPopup',
    'userDataService',
    'userData',
    function ($ionicPopup, userDataService, userData) {

        var vm = this;

        vm.courses = userData.courses;
        vm.showDelete = false;

        vm.deleteCourse = function (course) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Course',
                template: 'Are you sure you want to permanently delete this course?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    userDataService.deleteCourse(course).then(function (newCourseList) {
                        vm.courses = newCourseList;
                        vm.showDelete = false;
                    });
                }
            });
        };
    }
]);