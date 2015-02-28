'use strict';
statracker.factory('accountService', [
    '$http',
    '$q',
    'localStore',
    'jwtHelper',
    'apiUrl',
    'tokenUrl',
    'clientId',
    function ($http, $q, localStore, jwtHelper, apiUrl, tokenUrl, clientId) {

        var user = {
                authenticated: false
            };

        var login = function (credentials) {
            var deferred = $q.defer(),
                data = 'grant_type=password&username=' + encodeURIComponent(credentials.email) + '&password=' + encodeURIComponent(credentials.password) + '&client_id=' + encodeURIComponent(clientId);

            $http({
                url: tokenUrl,
                method: 'POST',
                data: data,
                skipAuthorization: true,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (response) {
                //decode the token
                var claims = jwtHelper.decodeToken(response.access_token);
                //populate our user object
                user.authenticated = true;
                user.id = claims.nameid;
                user.name = claims.sub; //TODO: would like to separate these, maybe?
                user.email = claims.sub;
                //store the tokens
                localStore.set('user', user);
                localStore.set('access_token', response.access_token);
                localStore.set('refresh_token', response.refresh_token);
                deferred.resolve();
            })
            .error(function (error) {
                logout();
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(apiUrl + 'account/logout');
            }
            localStore.remove('access_token');
            localStore.remove('refresh_token');
            localStore.remove('user');
            user = {
                authenticated: false
            };
            return user;
        };

        var register = function (registration) {
            logout();
            return $http({
                url: apiUrl + 'account/register',
                method: 'POST',
                data: registration,
                skipAuthorization: true
            });
        };

        var getUser = function () {
            if (user.id !== undefined) {
                return user;
            } else {
                var storedUser = localStore.get('user');
                if (storedUser !== undefined && storedUser !== null){
                    user = storedUser;
                }
            }
            return user;
        };

        var refresh = function () {
            var token = localStore.get('refresh_token'),
                data = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(token) + '&client_id=' + encodeURIComponent(clientId);
            if (token) {
                return $http({
                    url: tokenUrl,
                    method: 'POST',
                    skipAuthorization: true,
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (response) {
                    localStore.set('access_token', response.access_token);
                    localStore.set('refresh_token', response.refresh_token);
                })
                .error(function () {
                    logout();
                });
            }
        };

        return {
            login: login,
            logout: logout,
            register: register,
            user: getUser,
            refresh: refresh
        };
    }
]);

statracker.controller('ClubDetailController', [
    '$state',
    '$scope',
    'userDataService',
    function ($state, $scope, userDataService) {

        var vm = this;

        userDataService.getDefaultClubs().then(function (clubs) {
            vm.clubs = clubs;
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.userClub = $state.params.club;
        });

        vm.saveClub = function () {
            if (!vm.userClub.key) {
                //the club child object is not populated by our api call
                var club = vm.clubs.find(function (c) {
                    return c.key === vm.userClub.clubKey;
                });
                vm.userClub.key = 0;
                vm.userClub.club = {
                    key: club.key,
                    clubName: club.name
                };
                userDataService.addClub(vm.userClub).then(function () {
                    $state.go('^.my-bag');
                });
            } else {
                userDataService.updateClub(vm.userClub).then(function () {
                    $state.go('^.my-bag');
                });
            }
        };
    }
]);
statracker.controller('CourseDetailController', [
    '$state',
    '$scope',
    'userDataService',
    function ($state, $scope, userDataService) {

        var vm = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            userDataService.getCourse($state.params.key).then(function (response) {
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
statracker.controller('LoginController', [
    '$state',
    'accountService',
    function ($state, accountService) {

        var vm = this;

        vm.credentials = {
            email: '',
            password: '',
            hasError: false,
            error: ''
        };

        vm.canLogin = function () {
            if (vm.credentials.email && //email will be undefined until is looks valid
                vm.credentials.email.length > 0 &&
                vm.credentials.password &&
                vm.credentials.password.length > 0) {
                return true;
            }
            return false;
        };

        this.doLogin = function () {
            vm.credentials.hasError = false;
            vm.credentials.error = '';
            accountService.login(this.credentials)
                .then(function () {
                    $state.go('tab.rounds');
                }, function (error) {
                    vm.credentials.hasError = true;
                    if (error === null) {
                        vm.credentials.error = 'Cannot reach the StaTracker authorization server';
                    } else {
                        vm.credentials.error = error.error_description;
                    }
                });
        };
    }
]);

statracker.directive('login', [function () {
    return {
        scope: {},
        templateUrl: 'js/account/login.html',
        replace: true,
        bindToController: true,
        controller: 'loginController',
        controllerAs: 'ctrl'
    };
}]).controller('loginController', ['$state', 'accountService', function ($state, accountService) {

    this.credentials = {
        email: '',
        password: '',
        hasError: false,
        error: ''
    };

    this.doLogin = function () {
        this.credentials.hasError = false;
        this.credentials.error = '';
        accountService.login(this.credentials)
            .success(function () {
                $state.go('tab.rounds');
            })
            .error(function (error) {
                this.credentials.hasError = true;
                this.credentials.error = error.error_description;
            });
    };
}]);

statracker.controller('MyBagController', [
    '$scope',
    'userDataService',
    'userData',
    function ($scope, userDataService, userData) {

        var vm = this;

        vm.showDelete = false;

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.userClubs = userData.clubs;
        });

        vm.deleteClub = function (club) {
            userDataService.removeClub(club).then(function (clubs) {
                vm.userClubs = clubs;
                vm.showDelete = false;
            });
        };
    }
]);
statracker.directive('myCourses', [
    '$ionicTemplateLoader',
    '$ionicBackdrop',
    '$timeout',
    '$rootScope',
    '$document',
    function ($ionicTemplateLoader, $ionicBackdrop, $timeout, $rootScope, $document) {
        return {
            require: '?ngModel',
            restrict: 'E',
            template: '<input type="text" class="my-courses-control" autocomplete="off">',
            replace: true,
            scope: {
                courses: '='
            },
            link: function (scope, element, attrs, ngModel) {

                scope.filteredCourses = scope.courses; //TODO: copy

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
                                '<ion-item ng-repeat="course in filteredCourses" type="item-text-wrap" ng-click="selectCourse(course)">',
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
                                if (scope.courses && scope.courses.length > 0) {
                                    scope.filteredCourses = scope.courses.filter(function (course) {
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
statracker.controller('RegisterController', [
    '$state',
    'accountService',
    'userDataService',
    function ($state, accountService, userDataService) {

        var vm = this,
            defaultBag = [
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Driver' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 1 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '3 Wood' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 2 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '5 Wood' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 3 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '4 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 4 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '5 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 5 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '6 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 6 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '7 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 7 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '8 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 8 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '9 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 9 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Pitching Wedge' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 10 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Sand Wedge' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 11 }
            ];

        userDataService.getDefaultClubs().then(function (clubs) {
            defaultBag.forEach(function (c, i) {
                var defaultClub = clubs.find(function (d) {
                    return c.club.clubName === d.name;
                });
                if (defaultClub) {
                    defaultBag[i].clubKey = defaultClub.key;
                    defaultBag[i].club.key = defaultClub.key;
                } else {
                    //TODO: this is a problem
                    console.log('what gives?');
                }
            });
            userDataService.addClubs(defaultBag).then(function (clubs) {
                this.clubs = clubs;
            });
        });

        vm.registration = {
            email: '',
            password: '',
            confirmPassword: '',
            hasError: false,
            error: ''
        };

        vm.doRegister = function () {
            vm.registration.hasError = false;
            vm.registration.error = '';
            if (vm.validate()) {
                accountService.register(vm.registration)
                    .success(function () {
                        accountService.login(vm.registration).then(function () {
                            userDataService.getDefaultClubs().then(function (clubs) {
                                defaultBag.forEach(function (c, i) {
                                    var defaultClub = clubs.find(function (d) {
                                        return c.club.clubName === d.name;
                                    });
                                    if (defaultClub) {
                                        defaultBag[i].clubKey = defaultClub.key;
                                        defaultBag[i].club.key = defaultClub.key;
                                    } else {
                                        //TODO: this is a problem
                                        console.log('what gives?');
                                    }
                                });
                                userDataService.addClubs(defaultBag).then(function () {
                                    //TODO: how to handle an error here?
                                    //at this point, our new user should have a default set of clubs to use
                                    $state.go('tab.rounds');
                                });
                            });
                        });
                    })
                    .error(function (error) {
                        vm.registration.hasError = true;
                        if (error.error_description) {
                            vm.registration.error = error.error_description;
                        } else if (error.modelState) {
                            vm.registration.error = error.modelState;
                        } else {
                            vm.registration.error = error;
                        }
                    });
            }
        };

        vm.validate = function () {
            if (vm.registration.email === '') {
                vm.registration.hasError = true;
                vm.registration.error = 'An email address is required';
                return false;
            }
            if (vm.registration.password === '') {
                vm.registration.hasError = true;
                vm.registration.error = 'A password is required';
                return false;
            }
            if (vm.registration.password !== vm.registration.confirmPassword) {
                vm.registration.hasError = true;
                vm.registration.error = 'The passwords do not match';
                return false;
            }
            return true;
        };
    }
]);

statracker.controller('UserController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {

        $scope.user = accountService.user();

        $scope.doLogout = function () {
            accountService.logout();
            $state.go('login');
        };
    }
]);
statracker.factory('userDataService', [
    '$http',
    '$q',
    'apiUrl',
    function ($http, $q, apiUrl) {

        var clubs = [], courses = [], availableClubs = [];

        var loadUserData = function () {
            var p1 = $q.defer(),
                p2 = $q.defer();

            if (clubs && clubs.length > 0) {
                p1.resolve(clubs);
            } else {
                $http.get(apiUrl + 'users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    }
                    p1.resolve(clubs);
                });
            }

            if (courses && courses.length > 0) {
                p2.resolve(courses);
            } else {
                $http.get(apiUrl + 'users/courses').then(function (response) {
                    if (response.data) {
                        courses = response.data;
                    }
                    p2.resolve(courses);
                });
            }

            return $q.all([p1.promise,p2.promise]).then(function (results) {
                return {
                    clubs: results[0],
                    courses: results[1]
                };
            });
        };

        var addCourse = function (course) {
            var deferred = $q.defer(),
                description = course.description + '(' + course.tees + ')',
                existing = courses && courses.find(function (c) {
                        return c.description.toLowerCase() === description.toLowerCase();
                });
            if (existing) {
                deferred.resolve(existing);
            } else {
                var postCourse = {
                    key: 0,
                    courseDescription: course.description,
                    teesName: course.tees,
                    holesNumber: course.holes,
                    parNumber: course.par
                };
                $http.post(apiUrl + 'users/courses', postCourse).then(function (response) {
                    courses.push({
                        key: response.data.key,
                        description: response.data.courseDescription + ' (' + response.data.teesName + ')',
                        holes: response.data.holesNumber
                    });
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var createCourse = function (course) {
            var deferred = $q.defer(),
                description = course.courseDescription + '(' + course.teesName + ')',
                existing = courses && courses.find(function (c) {
                        return c.description.toLowerCase() === description.toLowerCase();
                    });
            if (existing) {
                deferred.reject('A course named ' + description + ' already exists');
            } else {
                $http.post(apiUrl + 'users/courses', course).then(function (response) {
                    courses.push({
                        key: response.data.key,
                        description: response.data.courseDescription + ' (' + response.data.teesName + ')',
                        holes: response.data.holesNumber
                    });
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var updateCourse = function (course) {
            return $http.put(apiUrl + 'users/courses/' + course.key, course);
        };

        var deleteCourse = function (course) {
            var deferred = $q.defer(),
                idx = courses.findIndex(function (c) {
                    return c.key === course.key;
                });
            $http.delete(apiUrl + 'users/courses/' + course.key).then(function () {
                courses.splice(idx, 1);
                deferred.resolve(courses);
            });
            return deferred.promise;
        };

        var getCourse = function (key) {
            return $http.get(apiUrl + 'users/courses/' + key);
        };

        var getClub = function (key) {
            return $http.get(apiUrl + 'users/clubs/' + key);
        };

        var addClub = function (club) {
            var deferred = $q.defer();
            $http.post(apiUrl + 'users/clubs', club).then(function (response) {
                clubs.push(response.data);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var addClubs = function (newClubs) {
            var deferred = $q.defer();
            $http.put(apiUrl + 'users/clubs', newClubs).then(function () {
                $http.get(apiUrl + 'users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                        deferred.resolve(clubs);
                    }
                });
            });
            return deferred.promise;
        };

        var updateClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            clubs[index] = club;
            $http.put(apiUrl + 'users/clubs/' + club.key, club).then(function () {
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var removeClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.delete(apiUrl + 'users/clubs/' + club.key).then(function () {
                clubs.splice(index, 1);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var getDefaultClubs = function () {
            var deferred = $q.defer();

            if (availableClubs && availableClubs.length > 0) {
                deferred.resolve(availableClubs);
            } else {
                $http.get(apiUrl + 'clubs').then(function (response) {
                    if (response.data) {
                        availableClubs = response.data.map(function (club) {
                            var approachFlag = true,
                                teeballFlag = false;
                            if (club.clubName === 'Driver' || club.clubName.endsWith('Wood')) {
                                approachFlag = false;
                                teeballFlag = true;
                            } else if (club.clubName === 'Putter') {
                                approachFlag = false;
                            }
                            return {
                                key: club.key,
                                name: club.clubName,
                                sortOrder: club.key,
                                approachFlag: approachFlag,
                                teeballFlag: teeballFlag
                            };
                        });
                    }
                    deferred.resolve(availableClubs);
                });
            }
            return deferred.promise;
        };

        return {
            get clubs() { return clubs; },
            get courses() { return courses; },
            getDefaultClubs: getDefaultClubs,
            loadUserData: loadUserData,
            addCourse: addCourse,
            getCourse: getCourse,
            createCourse: createCourse,
            updateCourse: updateCourse,
            deleteCourse: deleteCourse,
            getClub: getClub,
            addClub: addClub,
            addClubs: addClubs,
            updateClub: updateClub,
            removeClub: removeClub
        };
    }
]);
statracker.directive('holesSelect', [
    '$parse',
    function($parse){
        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            template: '<div class="holes-container button-bar"><a class="button button-holes button-small">9</a><a class="button button-holes button-small">18</a></div>',
            link: function(scope, elem, attrs, ngModelCtrl){
                var buttons = elem.find('a'),
                    value = $parse(attrs.ngModel)(scope),
                    updateButtons;

                updateButtons = function (value) {
                    angular.forEach(buttons, function (btn) {
                        var b = angular.element(btn);
                        if (btn.innerText == value) { // jshint ignore: line
                            if (!b.hasClass('button-calm')) {
                                b.addClass('button-calm');
                                b.removeClass('button-outline');
                            } else {
                                b.removeClass('button-stable');
                                b.addClass('button-outline');
                            }
                        } else {
                            if (b.hasClass('button-calm')) {
                                b.removeClass('button-calm');
                                b.addClass('button-outline');
                            } else {
                                b.addClass('button-stable');
                                b.removeClass('button-outline');
                            }
                        }
                    });
                };

                elem.bind('click', function () {
                    if (value === undefined) {
                        value = 18;
                    } else if (value === 9) {
                        value = 18;
                    } else {
                        value = 9;
                    }
                    ngModelCtrl.$setViewValue(value);
                    updateButtons(value);
                });

                updateButtons(value);
            }
        };
    }
]);
statracker.config([
    '$httpProvider',
    'jwtInterceptorProvider',
    function ($httpProvider, jwtInterceptorProvider) {

        //TODO: make sure we aren't intercepting calls we shouldn't be
        //the tokenGetter function returns a bearer token, which the angular-jwt
        //interceptor will attach to the request header on every request (unless
        //we tell it not to)
        jwtInterceptorProvider.tokenGetter = ['localStore', 'jwtHelper', 'accountService', function(localStore, jwtHelper, accountService) {
            var access_token = localStore.get('access_token'),
                refresh_token = localStore.get('refresh_token');

            //user is logged out, so we have no bearer token to attach to the request
            if (!access_token || !refresh_token) {
                return null;
            }

            //if the access token has expired - we use the refresh token to get a new one
            if (jwtHelper.isTokenExpired(access_token)) {
                return accountService.refresh()
                    .then(function (response) {
                        var new_token = response.data.access_token;
                        localStore.set('access_token', new_token);
                        return new_token;
                    });
            } else {
                return access_token;
            }

        }];
        $httpProvider.interceptors.push('jwtInterceptor');
    }
]);

statracker.run(['$rootScope', '$state', 'accountService', function ($rootScope, $state, accountService) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        var user = accountService.user(),
            secure = toState && toState.data && toState.data.secure;

        if (secure && (user === undefined || !user.authenticated)) {
            event.preventDefault();
            $state.go('login');
        }
    });
}]);

statracker.config([
    '$httpProvider',
    function ($httpProvider) {

        //broadcast an event with the start and end of each http call
        $httpProvider.interceptors.push(['$rootScope', '$q', '$injector', function($rootScope, $q, $injector) {
            var toaster;
            return {
                request: function(config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                response: function(response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                responseError: function (rejection) {
                    toaster = toaster || $injector.get('toaster');
                    $rootScope.$broadcast('loading:hide');
                    if (rejection.data.message) toaster.toastError(rejection.data.message);
                    else if (rejection.data.Message) toaster.toastError(rejection.data.Message);
                    else toaster.toastError(rejection.data);
                    return $q.reject(rejection);
                }
            };
        }]);
    }
]);

//register listeners to the http start and end events we configured above
statracker.run(['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: '<i class="icon ion-loading-b"></i>', noBackdrop: true});
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });
}]);

statracker.config([
    '$ionicConfigProvider',
    function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-ios7-arrow-left');
    }
]).run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function(searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) { // jshint ignore:line
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) { // jshint ignore:line
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
statracker.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'src/account/login-page.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/account/register-page.html'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'src/tabs.html',
                resolve: {
                    userData: ['userDataService', function(userDataService) {
                        return userDataService.loadUserData();
                    }]
                },
                data: {
                    secure: true
                }
            })

            .state('tab.user', {
                url: '/user',
                views: {
                    'settings': {
                        templateUrl: 'src/account/user-page.html'
                    }
                }
            })
            .state('tab.course-list', {
                url: '/course-list',
                views: {
                    'settings': {
                        templateUrl: 'src/account/course-list-page.html',
                        controller: 'CourseListController as vm',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.course-detail', {
                url: '/course-detail',
                params: {
                    key: 0
                },
                views: {
                    'settings': {
                        templateUrl: 'src/account/course-detail-page.html'
                    }
                }
            })
            .state('tab.my-bag', {
                url: '/my-bag',
                views: {
                    'settings': {
                        templateUrl: 'src/account/my-bag-page.html',
                        controller: 'MyBagController as vm',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.club-detail', {
                url: '/club-detail',
                params: {
                    club: {}
                },
                views: {
                    'settings': {
                        templateUrl: 'src/account/club-detail-page.html'
                    }
                }
            })

            .state('tab.rounds', {
                url: '/rounds',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/list-page.html'
                    }
                }
            })
            .state('tab.new-round', {
                url: '/new-round',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/create-page.html',
                        controller: 'CreateRoundController as ctrl',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.round-summary', {
                url: '/round-summary',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/round-summary-page.html'
                    }
                }
            })
            .state('tab.round-detail-teeball', {
                url: '/round-detail-teeball',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/tee/tee-page.html',
                        controller: 'TeeShotController as ctrl',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.round-detail-approach', {
                url: '/round-detail-approach',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/approach/approach-page.html',
                        controller: 'ApproachShotController as ctrl',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.round-detail-shortgame', {
                url: '/round-detail-shortgame',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/shortgame/shortgame-page.html'
                    }
                }
            })

            .state('tab.stats', {
                url: '/stats',
                views: {
                    'stats': {
                        templateUrl: 'src/stats/stats-page.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/rounds');
    }
]);

statracker.factory('localStore', ['store', function(store) {
    return store.getNamespacedStore('stk');
}]);

statracker.factory('toaster', [
    '$window',
    '$ionicPopup',
    '$timeout',
    '$q',
    function ($window, $ionicPopup, $timeout, $q) {
        return {
            toastSuccess: function (message) {
                var defer = $q.defer();
                var popup = $ionicPopup.alert({
                    title: 'Success!',
                    template: message
                });
                popup.then(function(res) {
                    defer.resolve(message);
                });
                $timeout(function() {
                    popup.close();
                }, 1500);
                return defer.promise;
            },
            toastError: function (message) {
                var defer = $q.defer();
                var popup = $ionicPopup.alert({
                    title: 'Fail!',
                    template: message
                });
                popup.then(function(res) {
                    defer.resolve(message);
                });
                $timeout(function() {
                    popup.close();
                }, 3000);
                return defer.promise;
            }
        };
    }
]);
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

statracker.directive('goto', [
    '$ionicPopover',
    function ($ionicPopover) {
        return {
            restrict: 'AE',
            template: '<button class="button button-small button-clear" ng-click="open($event)">Hole {{hole}}</button>',
            scope: {
                hole: '=',
                holes: '='
            },
            link: function(scope) {

                $ionicPopover.fromTemplateUrl('src/rounds/goto-popover.html', {
                    scope: scope
                }).then(function(popover) {
                    scope.popover = popover;
                });

                scope.open = function(e) {
                    scope.popover.show(e);
                };

                scope.goto = function(hole) {
                    if (hole <= scope.holes) {
                        scope.$emit('hole_change', hole);
                    }
                    scope.popover.hide();
                };

                scope.$on('$destroy', function() {
                    scope.popover.remove();
                });
            }
        };
    }
]);

statracker.directive('holeNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    'roundService',
    function ($state, $ionicGesture, $ionicViewSwitcher, roundService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                var destination = attrs.holeNext;

                $ionicGesture.on('swipe', function(event) {

                    if (event.gesture.direction === 'left') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('forward');

                        if ($state.is('tab.round-detail-shortgame'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            roundService.getCurrentRound().then(function (round) {
                                var hole = roundService.getCurrentHole();
                                if (hole == round.holes) { // jshint ignore:line
                                    roundService.setCurrentHole(1);
                                } else {
                                    roundService.setCurrentHole(hole + 1);
                                }
                            });
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);

statracker.directive('holePrev', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    'roundService',
    function ($state, $ionicGesture, $ionicViewSwitcher, roundService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                var destination = attrs.holePrev;

                $ionicGesture.on('swipe', function(event) {

                    if (event.gesture.direction === 'right') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('back');

                        if ($state.is('tab.round-detail-teeball'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            roundService.getCurrentRound().then(function (round) {
                                var hole = roundService.getCurrentHole();
                                if (hole == 1) { // jshint ignore:line
                                    roundService.setCurrentHole(round.holes);
                                } else {
                                    roundService.setCurrentHole(hole - 1);
                                }
                            });
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);
statracker.controller('ListRoundsController', [
    '$state',
    '$scope',
    'roundService',
    function ($state, $scope, roundService) {

        var vm = this;

        vm.rounds = [];
        vm.filter = {
            holes: 18,
            roundsToChart: 10,
            monthsToList: 3
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            vm.scores = {};
            roundService.getAll().then(function (response) {
                vm.rounds = response.data;
                vm.calculateRecentScores(vm.filter.roundsToChart, vm.filter.holes);
            });
        });

        $scope.$watch(angular.bind(vm, function () {
            return vm.filter.holes;
        }), function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                vm.calculateRecentScores(vm.filter.roundsToChart, vm.filter.holes);
            }
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

statracker.controller('RoundController', [
    '$scope',
    '$state',
    function ($scope, $state) {

        if (!$scope.round) {
            $scope.round = {};
        }
        $scope.round.id = $state.params.id;

        $scope.gotoDetails = function () {
            var params = $state.params;
            params.hole = 1;
            $state.go('^.round-detail-teeball', params);
        };
    }
]);

statracker.factory('roundService', [
    '$http',
    '$q',
    'localStore',
    'apiUrl',
    'accountService',
    function ($http, $q, localStore, apiUrl, accountService) {

        var currentRound;

        var getCurrentRound = function () {
            var deferred = $q.defer();
            if (currentRound) {
                deferred.resolve(currentRound);
            } else {
                var id = localStore.get('roundId');
                if (id) {
                    return loadRound(id);
                } else {
                    deferred.reject();
                }
            }
            return deferred.promise;
        };

        var loadRound = function (key) {
            var deferred = $q.defer(),
            round; // = currentRound;

            if (round && round.key === key) {
                deferred.resolve(round);
            } else {
                $http.get(apiUrl + 'rounds/' + key).then(function (response) {
                    currentRound = new statracker.Round(null, null, null, response.data);
                    localStore.set('roundId', currentRound.key);
                    deferred.resolve(currentRound);
                });
            }
            return deferred.promise;
        };

        var getRounds = function (limit) {
            if (!limit) limit = 20;
            return $http.get(apiUrl + 'rounds?limit=' + limit);
        };

        var createRound = function (course, datePlayed, holes) {
            currentRound = new statracker.Round(course, datePlayed, holes);
            localStore.set('roundId', currentRound.key);
            return currentRound;
        };

        var updateRound = function (round, doSynch) {
            var deferred = $q.defer();
            currentRound = round;
            if (doSynch) {
                var postRound = currentRound.toApi();
                postRound.userId = accountService.user().id;
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + 'rounds/' + currentRound.key, postRound).then(function () {
                        localStore.set('roundId', currentRound.key);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + 'rounds', postRound).then(function (response) {
                        currentRound.key = response.data.key; //TODO: import the response?
                        localStore.set('roundId', currentRound.key);
                        deferred.resolve(currentRound);
                    });
                }
            } else {
                localStore.set('roundId', currentRound.key);
                deferred.resolve(currentRound);
            }
            return deferred.promise;
        };

        var completeRound = function (round) {
            return updateRound(round, true).then(function () {
                if (round.isComplete) {
                    localStore.remove('roundId');
                }
            });
        };

        var deleteRound = function (key) {
            return $http.delete(apiUrl + 'rounds/' + key).then(function () {
                if (currentRound && currentRound.key === key) {
                    currentRound = undefined;
                    localStore.remove('roundId');
                }
            });
        };

        return {
            loadRound: loadRound,
            getAll: getRounds,
            getCurrentRound: getCurrentRound,
            setCurrentHole: function (hole) {
                localStore.set('hole', hole);
            },
            getCurrentHole: function () {
                var hole = localStore.get('hole');
                return (!hole ? 1 : hole);
            },
            create: createRound,
            update: updateRound,
            complete: completeRound,
            delete: deleteRound
        };
    }
]);

statracker.controller('RoundSummaryController', [
    'roundService',
    '$state',
    '$scope',
    'toaster',
    '$ionicPopup',
    function (roundService, $state, $scope, toaster, $ionicPopup) {

        var vm = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.stats = vm.round.calculateStats();
            },
            function () {
                toaster.toastError('Failed to get the current round');
                $state.go('^.rounds');
            });
        });

        vm.deleteRound = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Round',
                template: 'Are you sure you want to permanently delete this round?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    roundService.delete(vm.round.key).then(function () {
                        toaster.toastSuccess('Your round has been deleted').then(function () {
                            $state.go('^.rounds');
                        });
                    });
                }
            });
        };

        vm.saveRound = function (completed) {
            vm.round.isComplete = completed;
            roundService.complete(vm.round).then(function () {
                toaster.toastSuccess('Your round has been saved');
            });
        };

        vm.gotoDetails = function () {
            roundService.setCurrentHole(1);
            $state.go('^.round-detail-teeball');
        };

        vm.isComplete = function () {
            return vm.round && vm.round.isComplete;
        };

        vm.hasDrivingStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            var hasStats = vm.round &&
                vm.round.teeShots.some(function (shot) {
                    return shot.coordinates && shot.coordinates.x !== null;
                });
            return hasStats;
        };

        vm.hasApproachStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            var hasStats = vm.round &&
                vm.round.approachShots.some(function (shot) {
                    return shot.coordinates && shot.coordinates.x !== null;
                });
            return hasStats;
        };

        vm.hasShortgameStats = function () {
            if (vm.round && !vm.round.isComplete) return false;
            return vm.stats && vm.stats.putting && vm.stats.putting.putts > 0;
        };
    }
]);

(function (st) {

    var importRound, exportRound, round, fairwayStats, calculateStats,
        puttingStats, approachStats, upAndDownStats, sandSaveStats;

    importRound = function (self, r) {
        var hole;

        self.key = r.key;
        self.datePlayed = r.roundDate;
        self.courseKey = r.courseKey;
        self.courseDescription = r.course.courseDescription;
        self.holes = r.holesCount;
        self.score = r.scoreNumber;
        self.greens = r.greensNumber;
        self.fairways = r.fairwaysNumber;
        self.totalFairways = r.totalFairwaysNumber;
        self.isTournament = r.tournamentFlag;
        self.isComplete = r.completedFlag;
        self.notes = r.notesText;

        self.teeShots = [];
        self.approachShots = [];
        self.shortGameShots = [];

        for (hole = 0; hole < r.holesCount; hole++) {
            self.teeShots.push(new st.TeeShot(hole+1, r.teeShots[hole]));
            self.approachShots.push(new st.ApproachShot(hole+1, r.approachShots[hole]));
            self.shortGameShots.push(new st.ShortGame(hole+1, r.shortGameShots[hole]));
        }
    };

    round = function (course, datePlayed, holes, api) {
        var hole;

        if (api) {
            importRound(this, api);
        } else {
            this.key = undefined;
            this.courseKey = course.key;
            this.courseDescription = course.courseDescription;
            this.datePlayed = datePlayed;
            this.holes = holes;
            this.score = undefined;
            this.greens = undefined;
            this.fairways = undefined;
            this.totalFairways = (holes === 18) ? 14 : 7;
            this.notes = undefined;
            this.isTournament = false;
            this.isComplete = false;

            this.teeShots = [];
            this.approachShots = [];
            this.shortGameShots = [];

            for (hole = 1; hole <= holes; hole++) {
                this.teeShots.push(new st.TeeShot(hole));
                this.approachShots.push(new st.ApproachShot(hole));
                this.shortGameShots.push(new st.ShortGame(hole));
            }
        }
    };

    exportRound = function () {
        var outbound = {
            key: this.key,
            roundDate: this.datePlayed,
            courseKey: this.courseKey,
            holesCount: this.holes,
            scoreNumber: this.score,
            greensNumber: this.greens,
            fairwaysNumber: this.fairways,
            totalFairwaysNumber: this.totalFairways,
            notesText: this.notes,
            tournamentFlag: this.isTournament,
            completedFlag: this.isComplete,
            teeShots: [],
            approachShots: [],
            shortGameShots: []
        };
        var i;
        for (i = 0; i < this.holes; i++) {
            outbound.teeShots.push(this.teeShots[i].toApi(this.key));
            outbound.approachShots.push(this.approachShots[i].toApi(this.key));
            outbound.shortGameShots.push(this.shortGameShots[i].toApi(this.key));
        }
        return outbound;
    };

    fairwayStats = function (self) {
        var shots = 0, distance = 0, fairways = 0;
        self.teeShots.forEach(function (shot) {
            if (shot.distance) {
                distance += shot.distance;
                shots += 1;
                if (shot.result % 10 === 0) {
                    fairways += 1;
                }
            }
        });
        if (shots === 0) return 0;
        return {
            averageDistance: distance / shots,
            fairwaysHit: fairways
        };
    };

    approachStats = function (self) {
        var shots = 0,
            yardage = 0,
            distance = 0,
            greens = 0;
        self.approachShots.forEach(function (shot) {
            if (shot.yardage) {
                yardage += shot.yardage;
                shots += 1;
                if (shot.result <= 24) {
                    greens += 1;
                }
            }
        });
        self.shortGameShots.forEach(function (hole) {
            if (hole.initialPuttLength && !hole.sandSave && !hole.upAndDown) {
                distance += hole.initialPuttLength;
            }
        });
        return {
            averageYardage: (shots === 0) ? 0 : yardage / shots,
            averageLeave: (shots === 0) ? 0 : distance / greens,
            greensHit: greens
        };
    };

    puttingStats = function (self) {
        var putts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.putts) {
                putts += hole.putts;
            }
            if (hole.puttMadeLength) {
                distance += hole.puttMadeLength;
            }
        });
        return {
            putts: putts,
            madePutts: distance
        };
    };

    upAndDownStats = function (self) {
        var conversions = 0,
            attempts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.upAndDown !== null) {
                attempts += 1;
                conversions += (hole.upAndDown) ? 1 : 0;
                if (hole.initialPuttLength) distance += hole.initialPuttLength;
            }
        });
        return {
            attempts: attempts,
            conversions: conversions,
            percentage: (attempts === 0) ? 0 : 100 * conversions / attempts,
            averageLeave: (attempts === 0) ? 0 : distance / attempts
        };
    };

    sandSaveStats = function (self) {
        var conversions = 0,
            attempts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.sandSave !== null) {
                attempts += 1;
                conversions += (hole.sandSave) ? 1 : 0;
                if (hole.initialPuttLength) distance += hole.initialPuttLength;
            }
        });
        return {
            attempts: attempts,
            conversions: conversions,
            percentage: (attempts === 0) ? 0 : 100 * conversions / attempts,
            averageLeave: (attempts === 0) ? 0 : distance / attempts
        };
    };

    calculateStats = function () {
        var dd = fairwayStats(this),
            app = approachStats(this),
            p = puttingStats(this),
            uad = upAndDownStats(this),
            ss = sandSaveStats(this);
        return {
            driving: dd,
            approachShots: app,
            putting: p,
            upAndDowns: uad,
            sandSaves: ss
        };
    };

    round.prototype = {
        constructor: round,
        toApi: exportRound,
        calculateStats: calculateStats
    };

    st.Round = round;

}(statracker));
statracker.controller('StatsController', [
    function () {
        var vm = this;
        vm.stats = {};
    }
]);
statracker.directive('approachResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/approach/approach-result-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem) {

                var green = elem.find('path'),
                    svg = elem[0].querySelector('svg'),
                    xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var point = svg.createSVGPoint();

                var cursorPoint = function (evt) {
                    point.x = evt.clientX;
                    point.y = evt.clientY;
                    return point.matrixTransform(svg.getScreenCTM().inverse());
                };

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        console.warn('x or y is null');
                        return;
                    }
                    var use = document.createElementNS(xmlns, 'use'),
                        transform = 'translate(' + x + ',' + y + ') scale(1.0)';

                    if (clear) {
                        clearBalls();
                    }

                    use.setAttributeNS(xlinkns, 'xlink:href', '#ball');
                    use.setAttributeNS(null, 'transform', transform);
                    shots.appendChild(use);
                };

                var clearBalls = function () {
                    if (shots.hasChildNodes()) {
                        while(shots.firstChild) {
                            shots.removeChild(shots.firstChild);
                        }
                    }
                };

                scope.$watch('shot', function () {
                    console.debug('shot watch');
                    if (scope.shot) {
                        console.debug('shot exists');
                        clearBalls();
                        if (scope.shot.result != null && scope.shot.result >= 0) {
                            placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                        }
                    }
                });

                green.bind('click', function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    console.debug('green click at ' + scope.shot.result);
                    scope.$emit('stk.approach', scope.shot.getResultText());
                    if (!scope.shot.coordinates) {
                        scope.shot.coordinates = {x:0,y:0};
                    }
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    placeBall(cp.x, cp.y, true);
                });
            }
        };
    }
]);

statracker.directive('approachResultSummary', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/approach/approach-result-input.html',
            replace: true,
            scope: {
                round: '='
            },
            link: function (scope, elem) {

                var xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        //log warning
                        return;
                    }
                    var use = document.createElementNS(xmlns, 'use'),
                        transform = 'translate(' + x + ',' + y + ') scale(1.0)';

                    if (clear) {
                        clearBalls();
                    }

                    use.setAttributeNS(xlinkns, 'xlink:href', '#ball');
                    use.setAttributeNS(null, 'transform', transform);
                    shots.appendChild(use);
                };

                var clearBalls = function () {
                    if (shots.hasChildNodes()) {
                        while(shots.firstChild) {
                            shots.removeChild(shots.firstChild);
                        }
                    }
                };

                scope.$watch('round', function () {
                    if (scope.round && scope.round.approachShots) {
                        clearBalls();
                        scope.round.approachShots.forEach(function (shot) {
                            if (shot.coordinates != null) {
                                placeBall(shot.coordinates.x, shot.coordinates.y, false);
                            }
                        });
                    }
                });
            }
        };
    }
]);

statracker.controller('ApproachShotController', [
    '$state',
    '$scope',
    'roundService',
    'userData',
    function ($state, $scope, roundService, userData) {

        var vm = this;

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.approachShots[hole - 1];
                vm.shotDescription = vm.shot.getResultText();
            });
        });

        $scope.$on('$ionicView.loaded', function () {
            vm.clubs = userData.clubs.reduce(function(memo, club) {
                if (club.approachFlag) { // filter
                    memo.push({ // map
                        key: club.clubKey,
                        name: club.club.clubName
                    });
                }
                return memo;
            }, []);
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.shot = vm.round.approachShots[roundService.getCurrentHole() - 1];
                vm.shotDescription = vm.shot.getResultText();
            });
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });

        $scope.$on('stk.approach', function (e, result) {
            vm.shotDescription = result;
            $scope.$apply();
        });
    }
]);
(function (st) {

    var results = [
        'On the green, inside 3 feet',
        'On the green, inside 12 feet, short',
        'On the green, inside 12 feet, short right',
        'On the green, inside 12 feet, right',
        'On the green, inside 12 feet, long right',
        'On the green, inside 12 feet, long',
        'On the green, inside 12 feet, long left',
        'On the green, inside 12 feet, left',
        'On the green, inside 12 feet, short left',
        'On the green, inside 30 feet, short',
        'On the green, inside 30 feet, short right',
        'On the green, inside 30 feet, right',
        'On the green, inside 30 feet, long right',
        'On the green, inside 30 feet, long',
        'On the green, inside 30 feet, long left',
        'On the green, inside 30 feet, left',
        'On the green, inside 30 feet, short left',
        'On the green, outside 30 feet, short',
        'On the green, outside 30 feet, short right',
        'On the green, outside 30 feet, right',
        'On the green, outside 30 feet, long right',
        'On the green, outside 30 feet, long',
        'On the green, outside 30 feet, long left',
        'On the green, outside 30 feet, left',
        'On the green, outside 30 feet, short left',
        'Missed green (less than 6 feet), short',
        'Missed green (less than 6 feet), short right',
        'Missed green (less than 6 feet), right',
        'Missed green (less than 6 feet), long right',
        'Missed green (less than 6 feet), long',
        'Missed green (less than 6 feet), long left',
        'Missed green (less than 6 feet), left',
        'Missed green (less than 6 feet), short left',
        'Missed green, short',
        'Missed green, short right',
        'Missed green, right',
        'Missed green, long right',
        'Missed green, long',
        'Missed green, long left',
        'Missed green, left',
        'Missed green, short left'];

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.yardage = apiShot.yardageNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultX,
                y: apiShot.resultY
            };
        } else {
            this.key = undefined;
            this.hole = hole;
            this.clubKey = undefined;
            this.yardage = undefined;
            this.result = undefined;
            this.coordinates = undefined;
        }
    },
    toApi = function (parentKey) {
        return {
            key: this.key,
            roundKey: parentKey,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            yardageNumber: this.yardage,
            resultId: this.result,
            resultX: this.coordinates ? this.coordinates.x : undefined,
            resultY: this.coordinates ? this.coordinates.y : undefined
        };
    },
    resultText = function () {
        return results[this.result];
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi,
        getResultText: resultText
    };

    st.ApproachShot = shot;

}(statracker));
statracker.directive('attemptInput', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'src/rounds/shortgame/attempt-input.html',
            replace: true,
            scope: {
                flag: '=',
                round: '='
            },
            link: function (scope, elem) {

                var make = angular.element(elem[0].querySelector('#make')),
                    miss = angular.element(elem[0].querySelector('#miss')),
                    makeLines = make.find('line'),
                    makeCircle = make.find('circle'),
                    missLines = miss.find('line'),
                    missCircle = miss.find('circle');

                var showUndefined = function () {
                    if (!make.hasClass('attempt-unselected')) make.addClass('attempt-unselected');
                    if (make.hasClass('attempt-selected-make')) make.removeClass('attempt-selected-make');
                    if (!miss.hasClass('attempt-unselected')) miss.addClass('attempt-unselected');
                    if (miss.hasClass('attempt-selected-miss')) miss.removeClass('attempt-selected-miss');
                };

                var showTrue = function() {
                    if (make.hasClass('attempt-unselected')) make.removeClass('attempt-unselected');
                    if (!make.hasClass('attempt-selected-make')) make.addClass('attempt-selected-make');
                    if (!miss.hasClass('attempt-unselected')) miss.addClass('attempt-unselected');
                    if (miss.hasClass('attempt-selected-miss')) miss.removeClass('attempt-selected-miss');
                };

                var showFalse = function () {
                    if (!make.hasClass('attempt-unselected')) make.addClass('attempt-unselected');
                    if (make.hasClass('attempt-selected-make')) make.removeClass('attempt-selected-make');
                    if (miss.hasClass('attempt-unselected')) miss.removeClass('attempt-unselected');
                    if (!miss.hasClass('attempt-selected-miss')) miss.addClass('attempt-selected-miss');
                };

                var bindValue = function () {
                    if (scope.flag === true) {
                        showTrue();
                    } else if (scope.flag === false) {
                        showFalse();
                    } else {
                        showUndefined();
                    }
                };

                var handleMakeClick = function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    e.stopPropagation();
                    console.debug('make click');
                    if (!scope.flag) {
                        scope.flag = true;
                        showTrue();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                };

                var handleMissClick = function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    e.stopPropagation();
                    console.debug('miss click');
                    if (scope.flag === undefined || scope.flag === true) {
                        scope.flag = false;
                        showFalse();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                };

                scope.$watch('flag', function () {
                    bindValue();
                });

                make.bind('click', handleMakeClick);
                makeLines.bind('click', handleMakeClick);
                makeCircle.bind('click', handleMakeClick);

                miss.bind('click', handleMissClick);
                missLines.bind('click', handleMissClick);
                missCircle.bind('click', handleMissClick);
            }
        };
    }
]);
statracker.directive('puttsInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/shortgame/putts-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem) {

                var putts = elem.find('circle'),
                    puttsText = elem.find('text');

                var clearPutts = function () {
                    angular.forEach(putts, function (p) {
                        var putt = angular.element(p);
                        if (!putt.hasClass('putt-unselected')) putt.addClass('putt-unselected');
                        if (putt.hasClass('putt-selected')) putt.removeClass('putt-selected');
                    });
                    angular.forEach(puttsText, function (txt) {
                        var puttText = angular.element(txt);
                        if (!puttText.hasClass('putt-unselected')) puttText.addClass('putt-unselected');
                        if (puttText.hasClass('putt-selected')) puttText.removeClass('putt-selected');
                    });
                };

                var showPutt = function(value) {
                    angular.forEach(putts, function (p) {
                        var puttValue = parseInt(p.getAttribute(('data-value'))),
                            putt = angular.element(p);
                        if (puttValue === value) {
                            if (!putt.hasClass('putt-selected')) putt.addClass('putt-selected');
                            if (putt.hasClass('putt-unselected')) putt.removeClass('putt-unselected');
                        } else {
                            if (!putt.hasClass('putt-unselected')) putt.addClass('putt-unselected');
                            if (putt.hasClass('putt-selected')) putt.removeClass('putt-selected');
                        }
                    });
                    angular.forEach(puttsText, function (txt) {
                        var puttTextValue = parseInt(txt.textContent),
                            puttText = angular.element(txt);
                        if (puttTextValue === value) {
                            if (!puttText.hasClass('putt-selected')) puttText.addClass('putt-selected');
                            if (puttText.hasClass('putt-unselected')) puttText.removeClass('putt-unselected');
                        } else {
                            if (!puttText.hasClass('putt-unselected')) puttText.addClass('putt-unselected');
                            if (puttText.hasClass('putt-selected')) puttText.removeClass('putt-selected');
                        }
                    });
                };

                var bindValue = function () {
                    if (scope.shot && scope.shot.putts != null) {
                        showPutt(scope.shot.putts);
                    } else {
                        clearPutts();
                    }
                };

                scope.$watch('shot.putts', function (nv, ov) {
                    if (nv) {
                        bindValue();
                    } else {
                        clearPutts();
                    }
                });

                putts.bind('click', function () {
                    if (scope.round && scope.round.isComplete) return;
                    var value = parseInt(this.getAttribute(('data-value')));
                    scope.shot.putts = value;
                    bindValue();
                });

                puttsText.bind('click', function () {
                    if (scope.round && scope.round.isComplete) return;
                    var value = parseInt(this.textContent);
                    scope.shot.putts = value;
                    bindValue();
                });
            }
        };
    }
]);
statracker.controller('ShortGameController', [
    '$state',
    '$scope',
    'roundService',
    function ($state, $scope, roundService) {

        var vm = this;

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.shortGameShots[hole - 1];
            });
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                    vm.round = round;
                    vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];
                },
                function () {
                    console.log('failed to get the current round - redirecting to rounds list');
                    $state.go('^.rounds');
                });
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round, false); //true: doSynch with server
        });
    }
]);

(function (st) {

    var shortgame = function (hole, api) {
        if (api) {
            this.key = api.key;
            this.hole = api.holeNumber;
            this.initialPuttLength = api.initialLengthNumber;
            this.puttMadeLength = api.finalLengthNumber;
            this.putts = api.puttsCount;
            this.upAndDown = api.upAndDownFlag;
            this.sandSave = api.sandSaveFlag;
            this.holeOut = api.holeOutFlag;
        } else {
            this.key = undefined;
            this.hole = hole;
            this.initialPuttLength = undefined;
            this.puttMadeLength = undefined;
            this.putts = undefined;
            this.upAndDown = undefined;
            this.sandSave = undefined;
            this.holeOut = undefined;
        }
    },
    toApi = function (parentKey) {
        return {
            key: this.key,
            roundKey: parentKey,
            holeNumber: this.hole,
            initialLengthNumber: this.initialPuttLength,
            finalLengthNumber: this.puttMadeLength,
            puttsCount: this.putts,
            upAndDownFlag: this.upAndDown,
            sandSaveFlag: this.sandSave,
            holeOutFlag: this.holeOut
        };
    };

    shortgame.prototype = {
        constructor: shortgame,
        toApi: toApi
    };

    st.ShortGame = shortgame;

}(statracker));
statracker.directive('teeResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/tee/tee-result-input.html',
            replace: true,
            scope: {
                shot: '=',
                round: '='
            },
            link: function (scope, elem) {

                var fairway = elem.find('rect'),
                    svg = elem[0].querySelector('svg'),
                    xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var point = svg.createSVGPoint();

                var cursorPoint = function (evt) {
                    point.x = evt.clientX;
                    point.y = evt.clientY;
                    return point.matrixTransform(svg.getScreenCTM().inverse());
                };

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        console.warn('x or y is null');
                        return;
                    }
                    var use = document.createElementNS(xmlns, 'use'),
                        transform = 'translate(' + x + ',' + y + ') scale(1.0)';

                    if (clear) {
                        clearBalls();
                    }

                    use.setAttributeNS(xlinkns, 'xlink:href', '#ball');
                    use.setAttributeNS(null, 'transform', transform);
                    shots.appendChild(use);
                };

                var clearBalls = function () {
                    if (shots.hasChildNodes()) {
                        while(shots.firstChild) {
                            shots.removeChild(shots.firstChild);
                        }
                    }
                };

                var calculateDistance = function (resultId) {
                    var distanceKey = Math.floor(resultId / 10) - 1,
                        baseDistance = 200;
                    return baseDistance + (5 * distanceKey);
                };

                var calculateCoordinates = function (distance) {
                    var x = scope.shot.coordinates && scope.shot.coordinates.x ? scope.shot.coordinates.x : 170;
                    var y = 372 - ((distance - 200) * 2.4);
                    return {
                        x: x,
                        y: y
                    };
                };

                //TODO: this should be a one-time thing - how to ensure that?
                scope.$watch('shot', function () {
                    if (scope.shot) {
                        clearBalls();
                        if (scope.shot.result != null && scope.shot.result >= 0) {
                            placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                        }
                    }
                });

                scope.$watch('shot.distance', function (newValue, oldValue) {
                    if (newValue === undefined || newValue === oldValue) return;
                    if (Number(newValue) > 200) {
                        scope.shot.coordinates = calculateCoordinates(Number(newValue));
                        placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                    }
                });

                fairway.bind('click', function (e) {
                    if (scope.round && scope.round.isComplete) return;
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    if (!scope.shot.coordinates) {
                        scope.shot.coordinates = {x:0,y:0};
                    }
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    scope.$emit('tee_shot_distance', calculateDistance(scope.shot.result));
                    placeBall(cp.x, cp.y, true);
                });
            }
        };
    }
]);

statracker.directive('teeResultSummary', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/tee/tee-result-input.html',
            replace: true,
            scope: {
                round: '='
            },
            link: function (scope, elem) {

                var xmlns = 'http://www.w3.org/2000/svg',
                    xlinkns = 'http://www.w3.org/1999/xlink',
                    shots = elem[0].querySelector('#shots');

                var placeBall = function (x, y, clear) {
                    if (x == null || y == null) {
                        //log warning
                        return;
                    }
                    var use = document.createElementNS(xmlns, 'use'),
                        transform = 'translate(' + x + ',' + y + ') scale(1.0)';

                    if (clear) {
                        clearBalls();
                    }

                    use.setAttributeNS(xlinkns, 'xlink:href', '#ball');
                    use.setAttributeNS(null, 'transform', transform);
                    shots.appendChild(use);
                };

                var clearBalls = function () {
                    if (shots.hasChildNodes()) {
                        while(shots.firstChild) {
                            shots.removeChild(shots.firstChild);
                        }
                    }
                };

                scope.$watch('round', function () {
                    if (scope.round && scope.round.teeShots) {
                        clearBalls();
                        scope.round.teeShots.forEach(function (shot) {
                            if (shot.coordinates != null) {
                                placeBall(shot.coordinates.x, shot.coordinates.y, false);
                            }
                        });
                    }
                });
            }
        };
    }
]);

statracker.controller('TeeShotController', [
    '$state',
    '$scope',
    'roundService',
    'userData',
    function ($state, $scope, roundService, userData) {

        var vm = this;

        vm.gotoSummary = function () {
            $state.go('^.round-summary');
        };

        $scope.$on('tee_shot_distance', function (e, distance) {
            vm.shot.distance = distance;
            $scope.$apply();
        });

        $scope.$on('hole_change', function(e, hole) {
            roundService.update(vm.round).then(function () {
                roundService.setCurrentHole(hole);
                vm.shot = vm.round.teeShots[hole - 1];
            });
        });

        $scope.$on('$ionicView.loaded', function () {
            vm.clubs = userData.clubs.reduce(function(memo, club) {
                if (club.teeballFlag) { // filter
                    memo.push({ // map
                        key: club.clubKey,
                        name: club.club.clubName
                    });
                }
                return memo;
            }, []);
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            roundService.getCurrentRound().then(function (round) {
                vm.round = round;
                vm.shot = vm.round.teeShots[roundService.getCurrentHole() - 1];
            },
            function () {
                console.log('failed to get the current round - redirecting to rounds list');
                $state.go('^.rounds');
            });
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });
    }
]);

(function (st) {

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.distance = apiShot.distanceNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultX,
                y: apiShot.resultY
            };
        } else {
            this.key = undefined;
            this.hole = hole;
            this.clubKey = undefined;
            this.distance = undefined;
            this.result = undefined;
            this.coordinates = undefined;
        }
    },
    toApi = function (parentKey) {
        return {
            key: this.key,
            roundKey: parentKey,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultX: this.coordinates ? this.coordinates.x : undefined,
            resultY: this.coordinates ? this.coordinates.y : undefined
        };
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi
    };

    st.TeeShot = shot;

}(statracker));