'use strict';
statracker.controller('HomeController', [
    function () {
    }
]);
angular.module("statracker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/tabs.html","<ion-view><ion-tabs class=tabs-stable><ion-tab title=Rounds icon=ion-flag ui-sref=tab.rounds><ion-nav-view name=rounds></ion-nav-view></ion-tab><ion-tab title=Statistics icon=ion-stats-bars ui-sref=tab.stats><ion-nav-view name=stats></ion-nav-view></ion-tab><ion-tab title=Settings icon=ion-gear-b ui-sref=tab.settings><ion-nav-view name=settings></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("templates/account/login.html","<ion-view view-title=Login><ion-content><div class=row><div class=col><form ng-submit=doLogin()><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email ng-model=login.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password ng-model=login.password></label> <label class=item><button class=\"button button-block button-positive\" type=submit>Log in</button></label></div></form></div></div><div class=row ng-show=login.hasError><div class=col><p>{{login.error}}</p></div></div><div class=row><div class=col><p>New to StaTracker?</p></div><div class=col><button class=\"button button-calm\" ui-sref=register>Register</button></div></div></ion-content></ion-view>");
$templateCache.put("templates/account/my-bag.html","<ion-view view-title=\"My Bag\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-clear\">Edit</button></ion-nav-buttons><ion-content><p>List of clubs for the logged in user, with a way to add, edit, remove clubs from the list. Each club also has editable attributes.</p></ion-content></ion-view>");
$templateCache.put("templates/account/preferences.html","<ion-view view-title=Preferences><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.settings>Back</button></ion-nav-buttons><ion-content><p>Preference settings governing app behavior</p></ion-content></ion-view>");
$templateCache.put("templates/account/register.html","<ion-view view-title=Register><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=login>Back</button></ion-nav-buttons><ion-content><div class=row><div class=col><form ng-submit=doRegister() novalidate><div class=list><label class=\"item item-input\"><span class=input-label>Email</span> <input type=email name=email ng-model=registration.email></label> <label class=\"item item-input\"><span class=input-label>Password</span> <input type=password name=password ng-model=registration.password></label> <label class=\"item item-input\"><span class=input-label>Confirm Password</span> <input type=password name=confirm ng-model=registration.confirmPassword></label> <label class=item><button class=\"button button-block button-positive\" type=submit>Register</button></label></div><div class=row ng-show=registration.hasError><div class=col><p>{{ registration.error }}</p></div></div></form></div></div></ion-content></ion-view>");
$templateCache.put("templates/account/settings.html","<ion-view view-title=Settings><ion-content><button class=\"button button-block\" ui-sref=^.my-bag>My Clubs</button> <button class=\"button button-block\" ui-sref=^.preferences>Preferences</button><p>You are logged in as {{user.name}}</p><button class=\"button button-block\" ng-click=doLogout()>Log Out</button></ion-content></ion-view>");
$templateCache.put("templates/rounds/approach-summary.html","<ion-view view-title=\"Approach Shots\"><ion-content scroll=false has-bouncing=false nav-prev=^.teeball-summary><p>Round id: {{ round.id }}</p><p>The green SVG image with all approach shots charted.</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/approach.html","<ion-view view-title=\"Approach Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-shortgame nav-prev=^.round-detail-teeball><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture the approach shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/create.html","<ion-view view-title=\"New Round\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-content><p>Form to create a new round and go directly to data-entry.</p><a class=\"button button-assertive\" ui-sref=\"^.round-detail-teeball({id: 400, hole: 1})\">Start</a></ion-content></ion-view>");
$templateCache.put("templates/rounds/goto.html","<ion-popover-view><ion-pane><h1>Go To Specific Hole</h1></ion-pane></ion-popover-view>");
$templateCache.put("templates/rounds/hole.html","<ion-view view-title=\"Round Detail\"><ion-tabs class=\"tabs-top tabs-stable\"><ion-tab title=\"Tee Ball\" ui-sref=tab.round-detail.teeball><ion-nav-view name=teeball></ion-nav-view></ion-tab><ion-tab title=Approach ui-sref=tab.round-detail.approach><ion-nav-view name=approach></ion-nav-view></ion-tab><ion-tab title=\"Short Game\" ui-sref=tab.round-detail.shortgame><ion-nav-view name=shortgame></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("templates/rounds/list.html","<ion-view view-title=\"My Rounds\"><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-plus\" ui-sref=^.new-round></button></ion-nav-buttons><ion-content><ion-list><ion-item ui-sref=\"tab.round-summary({id: 100})\">6/2/2015: Bunker Hills North to East Blue</ion-item><ion-item ui-sref=\"tab.round-summary({id: 200})\">6/5/2015: Bunker Hills North League</ion-item><ion-item ui-sref=\"tab.round-summary({id: 300})\">6/9/2015: Bunker Hills East to West White</ion-item></ion-list></ion-content></ion-view>");
$templateCache.put("templates/rounds/round-summary.html","<ion-view view-title=\"Round Overview\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ui-sref=^.rounds>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear\" ng-click=gotoDetails()>Details</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.teeball-summary><p>Round id: {{ round.id }}</p><p>Controls to enter the basic round statistics (fairways hit, gir, putts, etc.)</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-teeball nav-prev=^.round-detail-approach><p>Round id: {{ round.id }}</p><p>Controls to capture short game information for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/teeball-summary.html","<ion-view view-title=\"Tee Shots\"><ion-content scroll=false has-bouncing=false nav-next=^.approach-summary nav-prev=^.round-summary><p>Round id: {{ round.id }}</p><p>The fairway SVG image with all tee shots charted.</p></ion-content></ion-view>");
$templateCache.put("templates/rounds/teeball.html","<ion-view view-title=\"Tee Shot\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear\" ng-click=gotoSummary()>Back</button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small\" ng-click=openHoleNav()>{{hole.number}}</button></ion-nav-buttons><ion-content scroll=false has-bouncing=false nav-next=^.round-detail-approach nav-prev=^.round-detail-shortgame><p>Round id: {{ round.id }}</p><p>Custom SVG control to capture tee shot for hole {{hole.number}}</p></ion-content></ion-view>");
$templateCache.put("templates/stats/approach.html","<ion-view view-title=\"Approach Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.teeball nav-next=^.shortgame><p>Approach-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/filter.html","<ion-popover-view><ion-content><h1>Filter Settings</h1></ion-content></ion-popover-view>");
$templateCache.put("templates/stats/overall.html","<ion-view view-title=Overall><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.shortgame nav-next=^.teeball><p>Overall statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/shortgame.html","<ion-view view-title=\"Short Game\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.approach nav-next=^.overall><p>Short-game-only numerical statistics and trends for the current period.</p></ion-content></ion-view>");
$templateCache.put("templates/stats/stats.html","<ion-view><ion-nav-view name=stats-detail></ion-nav-view></ion-view>");
$templateCache.put("templates/stats/teeball.html","<ion-view view-title=\"Tee Shots\"><ion-nav-buttons side=primary><button class=\"button button-small button-clear icon ion-navicon\" ng-click=openMenu()></button></ion-nav-buttons><ion-nav-buttons side=secondary><button class=\"button button-small button-clear icon ion-funnel\" ng-click=openFilter()></button></ion-nav-buttons><ion-content has-bouncing=false nav-prev=^.overall nav-next=^.approach><p>Teeball-only numerical statistics, trends, and heat map for the current period.</p></ion-content></ion-view>");}]);
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
    'store',
    'jwtHelper',
    'apiUrl',
    'clientId',
    function ($http, store, jwtHelper, apiUrl, clientId) {

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
                store.set('user', user);
                store.set('access_token', response.access_token);
                store.set('refresh_token', response.refresh_token);
            })
            .error(function () {
                logout();
            });
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(apiUrl + 'api/account/logout');
            }
            store.remove('access_token');
            store.remove('refresh_token');
            store.remove('user');
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
            var user = store.get('user');
            return (user === undefined || user === null) ? undefined :user;
        };

        var refresh = function () {
            var token = store.get('refresh_token'),
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
                    store.set('access_token', response.access_token);
                    store.set('refresh_token', response.refresh_token);
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
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {

        $scope.login = {
            email: '',
            password: '',
            hasError: false,
            error: ''
        };

        $scope.doLogin = function () {
            $scope.login.hasError = false;
            $scope.login.error = '';
            accountService.login($scope.login)
                .success(function () {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
                    $scope.login.hasError = true;
                    $scope.login.error = error.error_description;
                });
        };
    }
]);

statracker.controller('MyBagController', [
    function () {

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

statracker.config([
    '$httpProvider',
    'jwtInterceptorProvider',
    function ($httpProvider, jwtInterceptorProvider) {

        //TODO: make sure we aren't intercepting calls we shouldn't be
        //the tokenGetter function returns a bearer token, which the angular-jwt
        //interceptor will attach to the request header on every request (unless
        //we tell it not to)
        jwtInterceptorProvider.tokenGetter = ['store', 'jwtHelper', 'accountService', function(store, jwtHelper, accountService) {
            var access_token = store.get('access_token'),
                refresh_token = store.get('refresh_token');

            //user is logged out, so we have no bearer token to attach to the request
            if (!access_token || !refresh_token) {
                return null;
            }

            //if the access token has expired - we use the refresh token to get a new one
            if (jwtHelper.isTokenExpired(access_token)) {
                return accountService.refresh()
                    .then(function (response) {
                        var new_token = response.data.access_token;
                        store.set('access_token', new_token);
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
]);

statracker.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/account/login.html',
                controller: 'LoginController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/account/register.html',
                controller: 'RegisterController'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                data: {
                    secure: true
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'settings': {
                        templateUrl: 'templates/account/settings.html',
                        controller: 'AccountController'
                    }
                }
            })
            .state('tab.preferences', {
                url: '/preferences',
                views: {
                    'settings': {
                        templateUrl: 'templates/account/preferences.html',
                        controller: 'PreferencesController'
                    }
                }
            })
            .state('tab.my-bag', {
                url: '/my-bag',
                views: {
                    'settings': {
                        templateUrl: 'templates/account/my-bag.html',
                        controller: 'MyBagController'
                    }
                }
            })

            .state('tab.rounds', {
                url: '/rounds',
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/list.html',
                        controller: 'ListRoundsController'
                    }
                }
            })
            .state('tab.new-round', {
                url: '/new-round',
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/create.html',
                        controller: 'CreateRoundController'
                    }
                }
            })
            .state('tab.round-summary', {
                url: '/round-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/round-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.teeball-summary', {
                url: '/teeball-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/teeball-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.approach-summary', {
                url: '/approach-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/approach-summary.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('tab.round-detail-teeball', {
                url: '/round-detail-teeball',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/teeball.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('tab.round-detail-approach', {
                url: '/round-detail-approach',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/approach.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('tab.round-detail-shortgame', {
                url: '/round-detail-shortgame',
                params: {id: 0, hole: 0},
                views: {
                    'rounds': {
                        templateUrl: 'templates/rounds/shortgame.html',
                        controller: 'HoleController'
                    }
                }
            })

            .state('tab.stats', {
                url: '/stats',
                views: {
                    'stats': {
                        templateUrl: 'templates/stats/stats.html',
                        controller: 'StatsController'
                    }
                }
            })
            .state('tab.stats.overall', {
                url: '/overall',
                views: {
                    'stats-detail': {
                        templateUrl: 'templates/stats/overall.html'
                    }
                }
            })
            .state('tab.stats.teeball', {
                url: '/teeball',
                views: {
                    'stats-detail': {
                        templateUrl: 'templates/stats/teeball.html'
                    }
                }
            })
            .state('tab.stats.approach', {
                url: '/approach',
                views: {
                    'stats-detail': {
                        templateUrl: 'templates/stats/approach.html'
                    }
                }
            })
            .state('tab.stats.shortgame', {
                url: '/shortgame',
                views: {
                    'stats-detail': {
                        templateUrl: 'templates/stats/shortgame.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    }
]);

statracker.controller('CreateRoundController', [
    function () {
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
    function () {

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

statracker.controller('StatsController', [
    '$scope',
    '$state',
    function ($state) {
        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);