'use strict';
statracker.controller('HomeController', [
    function () {
    }
]);
statracker.controller('StatsController', [
    '$scope',
    '$state',
    function ($state) {
        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);
statracker.controller('AccountController', [
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

statracker.factory('accountService', [
    '$http',
    'localStore',
    'jwtHelper',
    'apiUrl',
    'clientId',
    function ($http, localStore, jwtHelper, apiUrl, clientId) {

        var user = {
                authenticated: false,
                id: '',
                name: '',
                email: ''
            };

        var login = function (credentials) {
            var data = 'grant_type=password&username=' + credentials.email + '&password=' + credentials.password + '&client_id=' + clientId;
            return $http({
                url: apiUrl + 'token',
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
            })
            .error(function () {
                logout();
            });
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(apiUrl + 'api/account/logout').then(function () {
                    localStore.remove('access_token');
                    localStore.remove('refresh_token');
                    localStore.remove('user');
                });
            }
            user = {};
            return user;
        };

        var register = function (registration) {
            logout();
            return $http({
                url: apiUrl + 'api/account/register',
                method: 'POST',
                data: registration,
                skipAuthorization: true
            });
        };

        var getUser = function () {
            var user = localStore.get('user');
            return (user === undefined || user === null) ? undefined :user;
        };

        var refresh = function () {
            var token = localStore.get('refresh_token'),
                data = 'grant_type=refresh_token&refresh_token=' + token + '&client_id=' + clientId;
            if (token) {
                return $http({
                    url: apiUrl + 'token',
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
            return (
                vm.credentials.email && //email will be undefined until is looks valid
                vm.credentials.email.length > 0 &&
                vm.credentials.password &&
                vm.credentials.password.length > 0
            );
        };

        this.doLogin = function () {
            vm.credentials.hasError = false;
            vm.credentials.error = '';
            accountService.login(this.credentials)
                .success(function () {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
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
    '$ionicModal',
    'userDataService',
    'userData',
    function ($scope, $ionicModal, userDataService, userData) {

        var vm = this;

        vm.clubs = userData.clubs;
        vm.showDelete = false;

        userDataService.getDefaultClubs().then(function (clubs) {
            $scope.clubs = clubs;
            $ionicModal.fromTemplateUrl('src/account/edit-club-modal.html', {
                scope: $scope
            }).then(function (modal) {
                vm.modal = modal;
            });
        });

        $scope.cancel = function () {
            vm.modal.hide();
        };

        $scope.save = function () {
            vm.modal.hide();
            var club = $scope.currentClub;
            if ($scope.inEditMode) {
                userDataService.updateClub(club);
            } else {
                var selectedClub = $scope.clubs.find(function (c) {
                    return c.key === club.clubKey;
                });
                club.club.key = selectedClub.key;
                club.club.clubName = selectedClub.name;
                userDataService.addClub(club).then(function (clubs) {
                    vm.clubs = clubs;
                });
            }
        };

        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });

        vm.editClub = function (club) {
            $scope.inEditMode = true;
            if (!club) {
                club = {
                    key: 0,
                    club: {
                        key: -1,
                        clubName: ''
                    },
                    teeballFlag: false,
                    approachFlag: false,
                    sortOrderNumber: 99
                };
                $scope.inEditMode = false;
            }
            $scope.currentClub = club;
            vm.modal.show();
        };

        vm.deleteClub = function (club) {
            userDataService.removeClub(club).then(function (clubs) {
                vm.clubs = clubs;
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
statracker.controller('PreferencesController', [
    function () {

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
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    }
                    p1.resolve(clubs);
                });
            }

            if (courses && courses.length > 0) {
                p2.resolve(courses);
            } else {
                $http.get(apiUrl + '/api/users/courses').then(function (response) {
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

        var addCourse = function (description) {
            var deferred = $q.defer(),
                existing = courses && courses.find(function (c) {
                    return c.courseDescription.toLowerCase() === description.toLowerCase();
                });
            if (existing) {
                deferred.resolve(undefined);
            } else {
                $http.post(apiUrl + '/api/users/courses', { courseDescription: description }).then(function (response) {
                    courses.push(response.data);
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var addClub = function (club) {
            var deferred = $q.defer();
            $http.post(apiUrl + '/api/users/clubs', club).then(function (response) {
                club.key = response.data.key;
                clubs.push(club);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var addClubs = function (newClubs) {
            var deferred = $q.defer();
            $http.put(apiUrl + '/api/users/clubs', newClubs).then(function () {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                        deferred.resolve(clubs);
                    }
                });
            });
            return deferred.promise;
        };

        var updateClub = function (club) {
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.put(apiUrl + '/api/users/clubs/' + club.key, club).then(function (response) {
                club.key = response.data.key;
                clubs[index] = club;
            });
        };

        var removeClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.delete(apiUrl + '/api/users/clubs/' + club.key).then(function () {
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
                $http.get(apiUrl + '/api/clubs').then(function (response) {
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
            addClub: addClub,
            addClubs: addClubs,
            updateClub: updateClub,
            removeClub: removeClub
        };
    }
]);
(function (st) {

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.yardage = apiShot.yardageNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultXNumber,
                y: apiShot.resultYNumber
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
    toApi = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            yardageNumber: this.yardage,
            resultId: this.result,
            resultXNumber: this.coordinates ? this.coordinates.x : undefined,
            resultYNumber: this.coordinates ? this.coordinates.y : undefined
        };
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi
    };

    st.ApproachShot = shot;

}(statracker));
statracker.controller('CreateRoundController', [
    '$scope',
    '$state',
    'userDataService',
    'roundService',
    function ($scope, $state, userDataService, roundService) {

        var vm = this;

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

statracker.controller('HoleController', [
    '$scope',
    '$state',
    function ($scope, $state) {

        if (!$scope.round) {
            $scope.round = {};
        }
        $scope.round.id = $state.params.id;

        if (!$scope.hole) {
            $scope.hole = {};
        }
        $scope.hole.number = $state.params.hole;

        $scope.gotoSummary = function () {
            var params = $state.params;
            params.hole = undefined;
            $state.go('^.round-summary', params);
        };
    }
]);
statracker.controller('ListRoundsController', [
    '$state',
    'roundService',
    function ($state, roundService) {

        var vm = this;

        vm.rounds = [];

        roundService.getAll().then(function (response) {
            vm.rounds = response.data;
        });
    }
]);

statracker.directive('navNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var destination = attrs.navNext;
                $ionicGesture.on('swipe', function(event) {
                    if (event.gesture.direction === 'left') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('forward');
                        //very specific to hole by hole navigation
                        if ($state.is('tab.round-detail-shortgame'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            if ($state.params.hole !== undefined && $state.params.hole == 3) { // jshint ignore:line
                                $state.params.hole = 1;
                            } else {
                                $state.params.hole += 1;
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        };
    }
]);

statracker.directive('navPrev', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var destination = attrs.navPrev;
                $ionicGesture.on('swipe', function(event) {
                    if (event.gesture.direction === 'right') {
                        event.preventDefault();
                        $ionicViewSwitcher.nextDirection('back');
                        //very specific to hole by hole navigation
                        if ($state.is('tab.round-detail-teeball'))
                        {
                            $ionicViewSwitcher.nextDirection('swap');
                            if ($state.params.hole !== undefined && $state.params.hole == 1) { // jshint ignore:line
                                $state.params.hole = 3;
                            } else {
                                $state.params.hole -= 1;
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
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
    function ($http, $q, localStore, apiUrl) {

        var currentRound;

        var getCurrentRound = function () {
            if (currentRound) {
                return currentRound;
            }
            currentRound = localStore.get('round');
            return currentRound;
        };

        var getRound = function (key) {
            var deferred = $q.defer();
            $http.get(apiUrl + '/api/rounds/' + key).then(function (response) {
                currentRound = new statracker.Round(null, null, null, response.data);
                localStore.set('round', currentRound);
                deferred.resolve(currentRound);
            });
            return deferred.promise;
        };

        var getRounds = function () {
            return $http.get(apiUrl + '/api/rounds');
        };

        var createRound = function (course, datePlayed, holes) {
            currentRound = new statracker.Round(course, datePlayed, holes);
            localStore.set('round', currentRound);
            return currentRound;
        };

        var updateRound = function (round, doSynch) {
            var deferred = $q.defer();
            currentRound = round;
            if (doSynch) {
                var postRound = currentRound.toApi();
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + '/api/rounds/' + currentRound.key, postRound).then(function () {
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + '/api/rounds', postRound).then(function (response) {
                        currentRound.key = response.data.id;
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                }
            } else {
                localStore.set('round', currentRound);
                deferred.resolve(currentRound);
            }
            return deferred.promise;
        };

        var completeRound = function (round) {
            updateRound(round);
            localStore.remove('round');
        };

        var deleteRound = function (key) {
            $http.delete(apiUrl + '/api/rounds/' + key).then(function () {
                if (currentRound && currentRound.key === key) {
                    currentRound = undefined;
                    localStore.remove('round');
                }
            });
        };

        return {
            getCurrent: getCurrentRound,
            getOne: getRound,
            getAll: getRounds,
            create: createRound,
            update: updateRound,
            complete: completeRound,
            delete: deleteRound
        };
    }
]);

(function (st) {

    var importRound, exportRound, round;

    importRound = function (r) {
        var hole;

        this.key = r.key;
        this.datePlayed = r.roundDate;
        this.courseKey = r.courseKey;
        this.holes = r.holesCount;
        this.score = r.scoreNumber;
        this.greens = r.greensNumber;
        this.fairways = r.fairwaysNumber;
        this.penalties = r.penaltiesNumber;
        this.sandSaveAttempts = r.sandSaveAttemptsNumber;
        this.sandSaveConversions = r.sandSaveConvertedNumber;
        this.upAndDownAttempts = r.upAndDownAttemptsNumber;
        this.upAndDownConversions = r.upAndDownConvertedNumber;

        this.teeShots = [];
        this.approachShots = [];
        this.shortGameShots = [];

        for (hole = 0; hole < r.holesCount; hole++) {
            this.teeShots.push(new st.TeeShot(hole+1, r.teeShots[hole]));
            this.approachShots.push(new st.ApproachShot(hole+1, r.approachShots[hole]));
            this.shortGameShots.push(new st.ShortGame(hole+1, r.shortGameShots[hole]));
        }
    };

    round = function (course, datePlayed, holes, api) {
        var hole;

        if (api) {
            importRound(api);
        } else {
            this.key = undefined;
            this.courseKey = course.key;
            this.courseName = course.description;
            this.datePlayed = datePlayed;
            this.holes = holes;
            this.score = undefined;
            this.greens = undefined;
            this.fairways = undefined;
            this.penalties = undefined;
            this.sandSaveAttempts = undefined;
            this.sandSaveConversions = undefined;
            this.upAndDownAttempts = undefined;
            this.upAndDownConversions = undefined;

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
            penaltiesNumber: this.penalties,
            sandSaveAttemptsNumber: this.sandSaveAttempts,
            sandSaveConvertedNumber: this.sandSaveConversions,
            upAndDownAttemptsNumber: this.upAndDownAttempts,
            upAndDownConvertedNumber: this.upAndDownConversions,
            teeShots: [],
            approachShots: [],
            shortGameShots: []
        };
        var i;
        for (i = 0; i < this.holes; i++) {
            outbound.teeShots.push(this.teeShots[i].toApi());
            outbound.approachShots.push(this.approachShots[i].toApi());
            outbound.shortGameShots.push(this.shortGameShots[i].toApi());
        }
        return outbound;
    };

    round.prototype = {
        constructor: round,
        toApi: exportRound
    };

    st.Round = round;

}(statracker));
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
    toApi = function () {
        return {
            key: this.key,
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
(function (st) {

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.distance = apiShot.distanceNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultXNumber,
                y: apiShot.resultYNumber
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
    toApi = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultXNumber: this.coordinates ? this.coordinates.x : undefined,
            resultYNumber: this.coordinates ? this.coordinates.y : undefined
        };
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi
    };

    st.TeeShot = shot;

}(statracker));
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
        $httpProvider.interceptors.push(function($rootScope, $q) {
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
                    $rootScope.$broadcast('loading:hide');
                    //TODO: toast a message
                    return $q.reject(rejection);
                }
            };
        });
    }
]);

//register listeners to the http start and end events we configured above
statracker.run(['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: 'Loading...', noBackdrop: true}); //TODO: something nicer
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

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'settings': {
                        templateUrl: 'src/account/settings.html',
                        controller: 'AccountController'
                    }
                }
            })
            .state('tab.preferences', {
                url: '/preferences',
                views: {
                    'settings': {
                        templateUrl: 'src/account/preferences.html',
                        controller: 'PreferencesController'
                    }
                }
            })
            .state('tab.my-bag', {
                url: '/my-bag',
                views: {
                    'settings': {
                        templateUrl: 'src/account/my-bag-page.html',
                        controller: 'MyBagController as vm',
                        //controllerAs: 'vm',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
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
                        templateUrl: 'src/rounds/create-page.html'
                    }
                }
            })
            .state('tab.round-summary', {
                url: '/round-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/round-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.teeball-summary', {
                url: '/teeball-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/teeball-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.approach-summary', {
                url: '/approach-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/approach-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.round-detail-teeball', {
                url: '/round-detail-teeball',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/teeball.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('tab.round-detail-approach', {
                url: '/round-detail-approach',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/approach.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('tab.round-detail-shortgame', {
                url: '/round-detail-shortgame',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/shortgame.html',
                        controller: 'HoleController'
                    }
                }
            })

            .state('tab.stats', {
                url: '/stats',
                views: {
                    'stats': {
                        templateUrl: 'src/stats/stats.html',
                        controller: 'StatsController'
                    }
                }
            })
            .state('tab.stats.overall', {
                url: '/overall',
                views: {
                    'stats-detail': {
                        templateUrl: 'src/stats/overall.html'
                    }
                }
            })
            .state('tab.stats.teeball', {
                url: '/teeball',
                views: {
                    'stats-detail': {
                        templateUrl: 'src/stats/teeball.html'
                    }
                }
            })
            .state('tab.stats.approach', {
                url: '/approach',
                views: {
                    'stats-detail': {
                        templateUrl: 'src/stats/approach.html'
                    }
                }
            })
            .state('tab.stats.shortgame', {
                url: '/shortgame',
                views: {
                    'stats-detail': {
                        templateUrl: 'src/stats/shortgame.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    }
]);

statracker.factory('localStore', ['store', function(store) {
    return store.getNamespacedStore('stk');
}]);
