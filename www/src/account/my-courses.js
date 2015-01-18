statracker.directive('myCourses', [
    '$ionicTemplateLoader',
    '$ionicBackdrop',
    '$timeout',
    '$rootScope',
    '$document',
    'userDataService',
    function ($ionicTemplateLoader, $ionicBackdrop, $timeout, $rootScope, $document, userDataService) {
        return {
            require: '?ngModel',
            restrict: 'E',
            template: '<input type="text" class="my-courses-control" autocomplete="off">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {

                var userData = userDataService.loadUserData(); //TODO: pass in via scope
                scope.courses = userData.courses;

                var searchEventTimeout,
                    POPUP_TPL = [
                    '<div class="my-courses-container">',
                        '<div class="bar bar-header item-input-inset">',
                            '<label class="item-input-wrapper">',
                                '<i class="icon ion-ios7-search placeholder-icon"></i>',
                                '<input type="search" ng-model="searchQuery" placeholder="Enter a course description">',
                            '</label>',
                            '<button class="button button-clear">Save</button>',
                        '</div>',
                        '<ion-content class="has-header">',
                            '<ion-list>',
                                '<ion-item ng-repeat="course in courses" type="item-text-wrap" ng-click="selectCourse(course)">',
                                    '{{course.courseDescription}}',
                                '</ion-item>',
                            '</ion-list>',
                        '</ion-content>',
                    '</div>'
                ].join('');

                $ionicTemplateLoader.compile({
                    template: POPUP_TPL,
                    scope: scope,
                    appendTo: $document[0].body
                }).then(function (el) {
                    var searchInputElement = angular.element(el.element.find('input'));

                    scope.selectCourse = function (course) {
                        ngModel.$setViewValue(course);
                        ngModel.$render();
                        el.element.css('display', 'none');
                        $ionicBackdrop.release();
                    };

                    scope.$watch('searchQuery', function (query) {
                        if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                        searchEventTimeout = $timeout(function () {
                            if (!query) return;
                            scope.$apply(function () {
                                if (userData.courses && userData.courses.length > 0) {
                                    scope.courses = userData.courses.filter(function (course) {
                                        if (query === '' || course.courseDescription.startsWith(query)) {
                                            return course;
                                        }
                                    });
                                }
                            });
                        }, 100);
                    });

                    var onClick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $ionicBackdrop.retain();
                        el.element.css('display', 'block');
                        searchInputElement[0].focus();
                        setTimeout(function () {
                            searchInputElement[0].focus();
                        }, 0);
                    };

                    var onSave = function () {
                        var newCourse = {
                            key: 0,
                            courseDescription: searchInputElement[0].value
                        };
                        ngModel.$setViewValue(newCourse);
                        ngModel.$render();
                        scope.searchQuery = '';
                        $ionicBackdrop.release();
                        el.element.css('display', 'none');
                        scope.$emit('new-course', searchInputElement[0].value);
                    };

                    element.bind('click', onClick);
                    element.bind('touchend', onClick);

                    el.element.find('button').bind('click', onSave);
                });

                if (attrs.placeholder) {
                    element.attr('placeholder', attrs.placeholder);
                }

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!modelValue) return '';
                    return modelValue;
                });

                ngModel.$parsers.unshift(function (viewValue) {
                    return viewValue;
                });

                ngModel.$render = function () {
                    if (!ngModel.$viewValue) {
                        element.val('');
                    } else {
                        element.val(ngModel.$viewValue.courseDescription || '');
                    }
                };
            }
        };
    }
]);