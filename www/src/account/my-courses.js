statracker.directive('myCourses', [
    '$ionicTemplateLoader',
    '$ionicBackdrop',
    '$timeout',
    '$rootScope',
    '$document',
    'userData',
    function ($ionicTemplateLoader, $ionicBackdrop, $timeout, $rootScope, $document, userData) {
        return {
            require: '?ngModel',
            restrict: 'E',
            template: '<input type="text" readonly="readonly" class="course-control" autocomplete="off">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {

                scope.courses = userData.courses;

                var searchEventTimeout;

                var POPUP_TPL = [
                    '<div class="ion-google-place-container">',
                    '<div class="bar bar-header item-input-inset">',
                    '<label class="item-input-wrapper">',
                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                    '<input class="google-place-search" type="search" ng-model="searchQuery" placeholder="' + (attrs.searchPlaceholder || 'Enter a course description') + '">',
                    '</label>',
                    '<button class="button button-clear">',
                    attrs.labelCancel || 'Cancel',
                    '</button>',
                    '</div>',
                    '<ion-content class="has-header">',
                    '<ion-list>',
                    '<ion-item ng-repeat="course in courses" type="item-text-wrap" ng-click="selectCourse(course)">',
                    '{{course.description}}',
                    '</ion-item>',
                    '</ion-list>',
                    '</ion-content>',
                    '</div>'
                ].join('');

                var popupPromise = $ionicTemplateLoader.compile({
                    template: POPUP_TPL,
                    scope: scope,
                    appendTo: $document[0].body
                });

                popupPromise.then(function (el) {
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
                                scope.courses = userData.courses.filter(function (course) {
                                    if (course.startsWith(query)) {
                                        return course;
                                    }
                                });
                            });
                        }, 0);
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

                    var onCancel = function () {
                        scope.searchQuery = '';
                        $ionicBackdrop.release();
                        el.element.css('display', 'none');
                    };

                    element.bind('click', onClick);
                    element.bind('touchend', onClick);

                    el.element.find('button').bind('click', onCancel);
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
                        element.val(ngModel.$viewValue.description || '');
                    }
                };
            }
        };
    }
]);