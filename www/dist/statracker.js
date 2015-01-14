'use strict';
statracker.controller('HomeController', [
    function () {
    }
]);
angular.module("statracker").run(["$templateCache", function($templateCache) {$templateCache.put("src/tabs.html","<ion-view><ion-tabs class=tabs-stable><ion-tab title=Rounds icon=ion-flag ui-sref=tab.rounds><ion-nav-view name=rounds></ion-nav-view></ion-tab><ion-tab title=Statistics icon=ion-stats-bars ui-sref=tab.stats><ion-nav-view name=stats></ion-nav-view></ion-tab><ion-tab title=Settings icon=ion-gear-b ui-sref=tab.settings><ion-nav-view name=settings></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("src/account/login-page.html","<ion-view view-title=Login ng-controller=\"LoginController as ctrl\"><ion-content><div class=row><div class=col><form ng-submit=ctrl.doLogin()><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email ng-model=ctrl.credentials.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password ng-model=ctrl.credentials.password></label> <label class=item><button class=\"button button-block button-positive\" type=submit ng-disabled=!ctrl.canLogin()>Log in</button></label></div></form></div></div><div class=row ng-show=ctrl.credentials.hasError><div class=col><p>{{ctrl.credentials.error}}</p></div></div><div class=row><div class=col><p>New to StaTracker?</p></div><div class=col><button class=\"button button-calm\" ui-sref=register>Register</button></div></div></ion-content></ion-view>");
$templateCache.put("src/account/my-bag.html","<ion-view view-title=\"My Bag\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-clear\">Edit</button></ion-nav-buttons><ion-content><p>List of clubs for the logged in user, with a way to add, edit, remove clubs from the list. Each club also has editable attributes.</p></ion-content></ion-view>");
$templateCache.put("src/account/preferences.html","<ion-view view-title=Preferences><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-content><p>Preference settings governing app behavior</p></ion-content></ion-view>");
$templateCache.put("src/account/register.html","<ion-view view-title=Register><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=login>Back</button></ion-nav-buttons><ion-content><div class=row><div class=col><form ng-submit=doRegister() novalidate><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email name=email ng-model=registration.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password name=password ng-model=registration.password></label> <label class=\"item item-input\"><span class=input-label>Confirm Password</span> <input type=password name=confirm ng-model=registration.confirmPassword></label> <label class=item><button class=\"button button-block button-positive\" type=submit>Register</button></label></div><div class=row ng-show=registration.hasError><div class=col><p>{{ registration.error }}</p></div></div></form></div></div></ion-content></ion-view>");
$templateCache.put("src/account/settings.html","<ion-view view-title=Settings><ion-content><button class=\"button button-block\" ui-sref=^.my-bag>My Clubs</button> <button class=\"button button-block\" ui-sref=^.preferences>Preferences</button><p>You are logged in as {{user.name}}</p><button class=\"button button-block\" ng-click=doLogout()>Log Out</button></ion-content></ion-view>");
$templateCache.put("src/rounds/approach-summary.html","<ion-view view-title=\"Approach Shots\"><ion-content scroll=false has-bouncing=false nav-prev=^.teeball-summary><p>Round id: {{ round.id }}</p><p>The green SVG image with all approach shots charted.</p></ion-content></ion-view>");
$templateCache.put("src/rounds/approach.html","<ion-view view-title=\"Approach Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-shortgame nav-prev=^.round-detail-teeball><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture the approach shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("src/rounds/create-page.html","<ion-view view-title=\"New Round\" ng-controller=\"CreateRoundController as ctrl\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-content><div class=row><div class=col><form ng-submit=ctrl.startRound()><div class=list><label class=\"item item-input\"><span class=input-label>Date</span> <input type=date ng-model=ctrl.round.date></label> <label class=\"item item-input\"><span class=input-label>Course</span><my-courses ng-model=ctrl.round.course></my-courses></label> <label class=\"item item-input\"><span class=input-label>Holes</span> <input type=tel ng-model=ctrl.round.holes></label> <label class=item><button class=\"button button-block button-positive\" type=submit ng-disabled=!ctrl.canStart()>Start</button></label></div></form></div></div><div class=row ng-show=ctrl.round.hasError><div class=col><p>{{ctrl.round.error}}</p></div></div></ion-content></ion-view>");
$templateCache.put("src/rounds/goto.html","<ion-popover-view><ion-pane><h1>Go To Specific Hole</h1></ion-pane></ion-popover-view>");
$templateCache.put("src/rounds/hole.html","<ion-view view-title=\"Round Detail\"><ion-tabs class=\"tabs-top tabs-stable\"><ion-tab title=\"Tee Ball\" ui-sref=tab.round-detail.teeball><ion-nav-view name=teeball></ion-nav-view></ion-tab><ion-tab title=Approach ui-sref=tab.round-detail.approach><ion-nav-view name=approach></ion-nav-view></ion-tab><ion-tab title=\"Short Game\" ui-sref=tab.round-detail.shortgame><ion-nav-view name=shortgame></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("src/rounds/list-page.html","<ion-view view-title=\"My Rounds\" ng-controller=\"ListRoundsController as ctrl\"><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-plus\" ui-sref=^.new-round></button></ion-nav-buttons><ion-content><div><p>graph of the last N rounds</p></div><div><p>average score for those last N rounds</p></div><ion-list><ion-item ng-repeat=\"round in ctrl.rounds\" ui-sref=\"tab.round-summary({id: {{round.key}}})\">{{round.date}} - ({{round.score}}): {{round.course.description}}</ion-item></ion-list></ion-content></ion-view>");
$templateCache.put("src/rounds/round-summary.html","<ion-view view-title=\"Round Overview\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear\" ng-click=gotoDetails()>Details</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.teeball-summary><p>Round id: {{ round.id }}</p><p>Controls to enter the basic round statistics (fairways hit, gir, putts, etc.)</p></ion-content></ion-view>");
$templateCache.put("src/rounds/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-teeball nav-prev=^.round-detail-approach><p>Round id: {{ round.id }}</p><p>Controls to capture short game information for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("src/rounds/teeball-summary.html","<ion-view view-title=\"Tee Shots\"><ion-content scroll=false has-bouncing=false nav-next=^.approach-summary nav-prev=^.round-summary><p>Round id: {{ round.id }}</p><p>The fairway SVG image with all tee shots charted.</p></ion-content></ion-view>");
$templateCache.put("src/rounds/teeball.html","<ion-view view-title=\"Tee Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-approach nav-prev=^.round-detail-shortgame><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture tee shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("src/stats/approach.html","<ion-view view-title=\"Approach Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.teeball nav-next=^.shortgame><p>Approach-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");
$templateCache.put("src/stats/filter.html","<ion-popover-view><ion-content><h1>Filter Settings</h1></ion-content></ion-popover-view>");
$templateCache.put("src/stats/overall.html","<ion-view view-title=Overall><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.shortgame nav-next=^.teeball><p>Overall statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("src/stats/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.approach nav-next=^.overall><p>Short-game-only numerical statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("src/stats/stats.html","<ion-view><ion-nav-view name=stats-detail></ion-nav-view></ion-view>");
$templateCache.put("src/stats/teeball.html","<ion-view view-title=\"Tee Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.overall nav-next=^.approach><p>Teeball-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");}]);
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
                $http.post(apiUrl + 'api/account/logout');
            }
            localStore.remove('access_token');
            localStore.remove('refresh_token');
            localStore.remove('user');
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
    function () {

    }
]);
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
            template: '<input type="text" class="my-courses-control" autocomplete="off">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {

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
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {

        $scope.registration = {
            email: '',
            password: '',
            confirmPassword: '',
            hasError: false,
            error: ''
        };

        $scope.doRegister = function () {
            $scope.registration.hasError = false;
            $scope.registration.error = '';
            if ($scope.validate()) {
                accountService.register($scope.registration)
                    .success(function () {
                        accountService.login($scope.registration).then(function () {
                            $state.go('tab.rounds');
                        });
                    })
                    .error(function (error) {
                        $scope.registration.hasError = true;
                        if (error.error_description) {
                            $scope.registration.error = error.error_description;
                        } else if (error.modelState) {
                            $scope.registration.error = error.modelState;
                        } else {
                            $scope.registration.error = error;
                        }
                    });
            }
        };

        $scope.validate = function () {
            if ($scope.registration.email === '') {
                $scope.registration.hasError = true;
                $scope.registration.error = 'An email address is required';
                return false;
            }
            if ($scope.registration.password === '') {
                $scope.registration.hasError = true;
                $scope.registration.error = 'A password is required';
                return false;
            }
            if ($scope.registration.password !== $scope.registration.confirmPassword) {
                $scope.registration.hasError = true;
                $scope.registration.error = 'The passwords do not match';
                return false;
            }
            return true;
        };
    }
]);

statracker.factory('userData', [
    '$http',
    '$q',
    'apiUrl',
    function ($http, $q, apiUrl) {

        var clubs = [], courses = [];

        var loadUserData = function () {
            var p1 = $q.defer(),
                p2 = $q.defer();

            if (clubs && clubs.length > 0) {
                p1.resolve(clubs);
            } else {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    } //TODO: else load default clubs for new user
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

            return $q.all([p1,p2]);
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

        return {
            get clubs() { return clubs; },
            get courses() { return courses; },
            loadUserData: loadUserData,
            addCourse: addCourse
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
                templateUrl: 'src/account/register.html'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'src/tabs.html',
                data: {
                    secure: true
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'settings': {
                        templateUrl: 'src/account/settings.html',
                        controller: 'AccountController',
                        resolve: {
                            userData: ['userData', function (userData) {
                                return userData.loadUserData();
                            }]
                        }
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
                        templateUrl: 'src/account/my-bag.html',
                        controller: 'MyBagController'
                    }
                }
            })

            .state('tab.rounds', {
                url: '/rounds',
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/list-page.html',
                        resolve: {
                            userData: ['userData', function (userData) {
                                return userData.loadUserData();
                            }]
                        }
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

(function (st) {

    var importShot, exportShot, shot;

    importShot = function (s) {
        this.key = s.key;
        this.hole = s.holeNumber;
        this.clubKey = s.clubKey;
        this.yardage = s.yardageNumber;
        this.result = s.resultId;
        this.coordinates = {
            x: s.resultXNumber,
            y: s.resultYNumber
        };
    };

    exportShot = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            yardageNumber: this.yardage,
            resultId: this.result,
            resultXNumber: this.coordinates.x,
            resultYNumber: this.coordinates.y
        };
    };

    shot = function (hole) {
        this.key = undefined;
        this.hole = hole;
        this.clubKey = undefined;
        this.yardage = undefined;
        this.result = undefined;
        this.coordinates = undefined;
    };

    shot.prototype = {
        constructor: shot,
        importShot: importShot,
        exportShot: exportShot
    };

    st.ApproachShot = shot;

}(statracker));
statracker.controller('CreateRoundController', [
    '$scope',
    '$state',
    'userData',
    'roundService',
    function ($scope, $state, userData, roundService) {

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
            userData.addCourse(courseName).then(function (data) {
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
    'roundService',
    function (roundService) {

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
                currentRound = statracker.Round.import(response.data);
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
                var updated = statracker.Round.export(round);
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + '/api/rounds/' + currentRound.key, updated).then(function () {
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + '/api/rounds', updated).then(function (response) {
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
        var i;
        for (i = 0; i < r.holesCount; i++) {
            this.teeShots.push(st.TeeShot.importShot(r.teeShots[i]));
            this.approachShots.push(st.ApproachShot.importShot(r.approachShots[i]));
            this.shortGameShots.push(st.ShortGame.importShots(r.shortGameShots[i]));
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
            outbound.teeShots.push(st.TeeShot.exportShot(this.teeShots[i]));
            outbound.approachShots.push(st.ApproachShot.exportShot(this.approachShots[i]));
            outbound.shortGameShots.push(st.ShortGame.exportShots(this.shortGameShots[i]));
        }
    };

    round = function (course, datePlayed, holes) {
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

        var hole;
        for (hole = 1; hole <= holes; hole++) {
            this.teeShots.push(new st.TeeShot(hole));
            this.approachShots.push(new st.ApproachShot(hole));
            this.shortGameShots.push(new st.ShortGame(hole));
        }
    };

    round.prototype = {
        constructor: round,
        import: importRound,
        export: exportRound
    };

    st.Round = round;

}(statracker));
(function (st) {

    var importShots, exportShots, shortgame;

    importShots = function (s) {
        this.key = s.key;
        this.hole = s.holeNumber;
        this.initialPuttLength = s.initialLengthNumber;
        this.puttMadeLength = s.finalLengthNumber;
        this.putts = s.puttsCount;
        this.upAndDown = s.upAndDownFlag;
        this.sandSave = s.sandSaveFlag;
        this.holeOut = s.holeOutFlag;
    };

    exportShots = function () {
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

    shortgame = function (hole) {
        this.key = undefined;
        this.hole = hole;
        this.initialPuttLength = undefined;
        this.puttMadeLength = undefined;
        this.putts = undefined;
        this.upAndDown = undefined;
        this.sandSave = undefined;
        this.holeOut = undefined;
    };

    shortgame.prototype = {
        constructor: shortgame,
        importShots: importShots,
        exportShots: exportShots
    };

    st.ShortGame = shortgame;

}(statracker));
(function (st) {

    var importShot, exportShot, shot;

    importShot = function (s) {
        this.key = s.key;
        this.hole = s.holeNumber;
        this.clubKey = s.clubKey;
        this.distance = s.distanceNumber;
        this.result = s.resultId;
        this.coordinates = {
            x: s.resultXNumber,
            y: s.resultYNumber
        };
    };

    exportShot = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultXNumber: this.coordinates.x,
            resultYNumber: this.coordinates.y
        };
    };

    shot = function (hole) {
        this.key = undefined;
        this.hole = hole;
        this.clubKey = undefined;
        this.distance = undefined;
        this.result = undefined;
        this.coordinates = undefined;
    };

    shot.prototype = {
        constructor: shot,
        importShot: importShot,
        exportShot: exportShot
    };

    st.TeeShot = shot;

}(statracker));
statracker.controller('StatsController', [
    '$scope',
    '$state',
    function ($state) {
        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);