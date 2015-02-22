(function () {
    'use strict';

    describe('course-detail-controller', function () {

        var my_user_data_service, my_state, my_scope, ctrl;

        beforeEach(module('statracker'));

        beforeEach(inject(function ($q) {
            my_user_data_service = {
                getCourse: function () {},
                createCourse: function () {},
                updateCourse: function () {}
            };
            my_state = {
                go: function () {}
            };
        }));

        beforeEach(function () {
            inject(function ($controller, $rootScope) {
                my_scope = $rootScope.$new();
                ctrl = $controller('CourseDetailController', {$state: my_state, $scope: my_scope, userDataService: my_user_data_service});
            });
        });

        describe('beforeEnter event handler', function () {

            it('should set the current course based on the id in the state params collection', inject(function ($q, $rootScope) {
                var deferred = $q.defer(),
                    course = {
                        key: 1,
                        courseDescription: 'Gopher Hills'
                    };
                deferred.resolve({
                    data: course
                });

                my_state.params = {
                    key: 1
                };

                spyOn(my_user_data_service, 'getCourse').and.returnValue(deferred.promise);

                $rootScope.$broadcast('$ionicView.beforeEnter');
                $rootScope.$digest();

                expect(my_user_data_service.getCourse).toHaveBeenCalledWith(1);
                expect(ctrl.course).toEqual(course);
            }));
        });

        describe('saveCourse', function () {

            beforeEach(inject(function ($q) {
                ctrl.course = {
                    courseDescription: 'Gopher Hills'
                };
                spyOn(my_state, 'go');
                spyOn(my_user_data_service, 'createCourse').and.returnValue($q.when({}));
                spyOn(my_user_data_service, 'updateCourse').and.returnValue($q.when({}));
            }));

            it('should add a new course if the current course key is undefined', function () {
                ctrl.saveCourse();
                expect(my_user_data_service.createCourse).toHaveBeenCalledWith(ctrl.course);
                my_scope.$digest();
                expect(my_state.go).toHaveBeenCalledWith('^.course-list');
            });

            it('should update an existing course if the course key is present', function () {
                ctrl.course.key = 1;
                ctrl.saveCourse();
                expect(my_user_data_service.updateCourse).toHaveBeenCalledWith(ctrl.course);
                my_scope.$digest();
                expect(my_state.go).toHaveBeenCalledWith('^.course-list');
            });
        });
    });
}());