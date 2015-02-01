'use strict';
statracker.controller('HomeController', [
    function () {
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
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/round-summary-page.html'
                    }
                }
            })
            .state('tab.teeball-summary', {
                url: '/teeball-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/tee/tee-summary-page.html'
                    }
                }
            })
            .state('tab.approach-summary', {
                url: '/approach-summary',
                params: {id: 0},
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/approach/approach-summary-page.html'
                    }
                }
            })
            .state('tab.round-detail-teeball', {
                url: '/round-detail-teeball',
                params: {id: 0, hole: 0},
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
                params: {id: 0, hole: 0},
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
                params: {id: 0, hole: 0},
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

statracker.controller('CreateRoundController', [
    '$scope',
    '$state',
    'userDataService',
    'roundService',
    'userData',
    function ($scope, $state, userDataService, roundService, userData) {

        var vm = this;

        vm.courses = userData.courses;

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
            roundService.update(newRound, true).then(function () {
                $state.go('^.round-detail-teeball');
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

statracker.directive('goto', [
    '$ionicPopover',
    function ($ionicPopover) {
        return {
            restrict: 'AE',
            template: '<button class="button button-small ion-ios7-flag" ng-click="open($event)"> {{hole}}</button>',
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
                            var round = roundService.getCurrentRound(),
                                hole = roundService.getCurrentHole();
                            if (hole == round.holes) { // jshint ignore:line
                                roundService.setCurrentHole(1);
                            } else {
                                roundService.setCurrentHole(hole + 1);
                            }
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
                            var round = roundService.getCurrentRound(),
                                hole = roundService.getCurrentHole();
                            if (hole == 1) { // jshint ignore:line
                                roundService.setCurrentHole(round.holes);
                            } else {
                                roundService.setCurrentHole(hole - 1);
                            }
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
    'roundService',
    function ($state, roundService) {

        var vm = this;

        vm.rounds = [];

        roundService.getAll().then(function (response) {
            vm.rounds = response.data;
        });

        vm.gotoSummary = function (roundId) {
            roundService.loadRound(roundId).then(function () {
                $state.go('tab.round-summary');
            });
        };
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

        var loadRound = function (key) {
            var deferred = $q.defer(),
                round = getCurrentRound();

            if (round && round.key === key) {
                deferred.resolve(round);
            } else {
                $http.get(apiUrl + '/api/rounds/' + key).then(function (response) {
                    currentRound = new statracker.Round(null, null, null, response.data);
                    localStore.set('round', currentRound);
                    deferred.resolve(currentRound);
                });
            }
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
                        currentRound.key = response.data.key; //TODO: import the response?
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
    function (roundService, $state) {

        var vm = this;

        vm.round = roundService.getCurrentRound();

        vm.gotoDetails = function () {
            var params = $state.params;
            params.hole = 1;
            $state.go('^.round-detail-teeball', params);
        };
    }
]);

(function (st) {

    var importRound, exportRound, round;

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
        self.penalties = r.penaltiesNumber;

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
            this.penalties = undefined; //TODO: change to total fairways

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
    '$q',
    'localStore',
    'jwtHelper',
    'apiUrl',
    'clientId',
    function ($http, $q, localStore, jwtHelper, apiUrl, clientId) {

        var user = {
                authenticated: false
            };

        var login = function (credentials) {
            var deferred = $q.defer(),
                data = 'grant_type=password&username=' + encodeURIComponent(credentials.email) + '&password=' + encodeURIComponent(credentials.password) + '&client_id=' + encodeURIComponent(clientId);

            $http({
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
                $http.post(apiUrl + 'api/account/logout');
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
                url: apiUrl + 'api/account/register',
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
statracker.directive('approachResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/approach/approach-result-input.html',
            replace: true,
            scope: {
                shot: '='
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
                        //log warning
                        return
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
                        var i, balls = shots.children;
                        for(i = 0; i < balls.length; i++) {
                            shots.removeChild(balls[i]);
                        }
                    }
                };

                scope.$watch('shot', function () {
                    clearBalls();
                    if (scope.shot.result != null && scope.shot.result >= 0) {
                        //scope.resultText = scope.shot.getResultText();
                        placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
                    }
                });

                green.bind('click', function (e) {
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    placeBall(cp.x, cp.y, true);
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
            vm.round = roundService.getCurrentRound();
            vm.shot = vm.round.approachShots[roundService.getCurrentHole() - 1];
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
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
statracker.directive('teeResultInput', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/tee/tee-result-input.html',
            replace: true,
            scope: {
                shot: '='
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
                        //log warning
                        return
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
                        var i, balls = shots.children;
                        for(i = 0; i < balls.length; i++) {
                            shots.removeChild(balls[i]);
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
                    clearBalls();
                    if (scope.shot.result != null && scope.shot.result >= 0) {
                        placeBall(scope.shot.coordinates.x, scope.shot.coordinates.y, true);
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
                    var cp = cursorPoint(e);
                    scope.shot.result = parseInt(this.getAttribute(('data-location')));
                    scope.shot.coordinates.x = cp.x;
                    scope.shot.coordinates.y = cp.y;
                    scope.$emit('tee_shot_distance', calculateDistance(scope.shot.result));
                    placeBall(cp.x, cp.y, true);
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
            vm.round = roundService.getCurrentRound();
            vm.shot = vm.round.teeShots[roundService.getCurrentHole() - 1];
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
        });
    }
]);

(function (st) {

    var results = [
        'Fairway, less than 200 yards',
        'Miss left (first cut up to 2 paces), less than 200 yards',
        'Miss right (first cut up to 2 paces), less than 200 yards',
        'Big miss left, less than 200 yards',
        'Big miss right, less than 200 yards',
        'Out of play (hazard or OB) left, less than 200 yards',
        'Out of play (hazard or OB) right, less than 200 yards',
        'Fairway, 200 - 225 yards',
        'Miss left (first cut up to 2 paces), 200 - 225 yards',
        'Miss right (first cut up to 2 paces), 200 - 225 yards',
        'Big miss left, 200 - 225 yards',
        'Big miss right, 200 - 225 yards',
        'Out of play (hazard or OB) left, 200 - 225 yards',
        'Out of play (hazard or OB) right, 200 - 225 yards',
        'Fairway, 225 - 250 yards',
        'Miss left (first cut up to 2 paces), 225 - 250 yards',
        'Miss right (first cut up to 2 paces), 225 - 250 yards',
        'Big miss left, 225 - 250 yards',
        'Big miss right, 225 - 250 yards',
        'Out of play (hazard or OB) left, 225 - 250 yards',
        'Out of play (hazard or OB) right, 225 - 250 yards',
        'Fairway, 250 - 275 yards',
        'Miss left (first cut up to 2 paces), 250 - 275 yards',
        'Miss right (first cut up to 2 paces), 250 - 275 yards',
        'Big miss left, 250 - 275 yards',
        'Big miss right, 250 - 275 yards',
        'Out of play (hazard or OB) left, 250 - 275 yards',
        'Out of play (hazard or OB) right, 250 - 275 yards',
        'Fairway, 275 - 300 yards',
        'Miss left (first cut up to 2 paces), 275 - 300 yards',
        'Miss right (first cut up to 2 paces), 275 - 300 yards',
        'Big miss left, 275 - 300 yards',
        'Big miss right, 275 - 300 yards',
        'Out of play (hazard or OB) left, 275 - 300 yards',
        'Out of play (hazard or OB) right, 275 - 300 yards',
        'Fairway, over 300 yards',
        'Miss left (first cut up to 2 paces), over 300 yards',
        'Miss right (first cut up to 2 paces), over 300 yards',
        'Big miss left, over 300 yards',
        'Big miss left, over 300 yards',
        'Out of play (hazard or OB) left, over 300 yards',
        'Out of play (hazard or OB) right, over 300 yards'
    ];

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
        toApi: toApi,
        getResultText: function () {
            return results[this.result];
        }
    };

    st.TeeShot = shot;

}(statracker));
statracker.directive('attemptInput', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'src/rounds/shortgame/attempt-input.html',
            replace: true,
            scope: {
                flag: '='
            },
            link: function (scope, elem, attrs) {

                var make = angular.element(elem[0].querySelector('#make')),
                    miss = angular.element(elem[0].querySelector('#miss'));

                var showUndefined = function () {
                    if (!make.hasClass('unselected')) make.addClass('unselected');
                    if (!miss.hasClass('unselected')) miss.addClass('unselected');
                };

                var showTrue = function() {
                    if (make.hasClass('unselected')) make.removeClass('unselected');
                    if (!miss.hasClass('unselected')) miss.addClass('unselected');
                };

                var showFalse = function () {
                    if (!make.hasClass('unselected')) make.addClass('unselected');
                    if (miss.hasClass('unselected')) miss.removeClass('unselected');
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

                bindValue();

                scope.$watch('flag', function () {
                    bindValue();
                });

                make.bind('click', function () {
                    if (scope.flag === undefined) {
                        scope.flag = true;
                        showTrue();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                    //scope.$apply();
                });

                miss.bind('click', function () {
                    if (scope.flag === undefined || scope.flag === true) {
                        scope.flag = false;
                        showFalse();
                    } else {
                        scope.flag = undefined;
                        showUndefined();
                    }
                    //scope.$apply();
                });
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
                shot: '='
            },
            link: function (scope, elem, attrs) {

                var putts = elem.find('circle');

                var clearPutts = function () {
                    angular.forEach(putts, function (p) {
                        var putt = angular.element(p);
                        if (!putt.hasClass('unselected')) putt.addClass('unselected');
                        if (putt.hasClass('selected')) putt.removeClass('selected');
                    });
                };

                var showPutt = function(value) {
                    angular.forEach(putts, function (p) {
                        var puttValue = parseInt(p.getAttribute(('data-value'))),
                            putt = angular.element(p);
                        if (puttValue === value) {
                            if (!putt.hasClass('selected')) putt.addClass('selected');
                            if (putt.hasClass('unselected')) putt.removeClass('unselected');
                        } else {
                            if (!putt.hasClass('unselected')) putt.addClass('unselected');
                            if (putt.hasClass('selected')) putt.removeClass('selected');
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

                bindValue();

                scope.$watch('shot', function () {
                    bindValue();
                });

                putts.bind('click', function () {
                    var value = parseInt(this.getAttribute(('data-value')));
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

        //vm.round = roundService.getCurrentRound();
        //vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];

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
            vm.round = roundService.getCurrentRound();
            vm.shot = vm.round.shortGameShots[roundService.getCurrentHole() - 1];
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            roundService.update(vm.round);
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