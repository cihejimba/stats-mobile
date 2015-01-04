// StaTracker Mobile App
var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages'])

    .run(function ($ionicPlatform) {
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
//TODO: move to a polyfill file
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
angular.module('statracker').controller('HomeController', [
    '$scope',
    function ($scope) {
        'use strict';

    }
]);
angular.module("statracker").run(["$templateCache", function($templateCache) {$templateCache.put("templates/tabs.html","<ion-view>\r\n    <ion-tabs class=\"tabs-stable\">\r\n        <ion-tab title=\"Rounds\" icon=\"ion-flag\" ui-sref=\"tab.rounds\">\r\n            <ion-nav-view name=\"rounds\"></ion-nav-view>\r\n        </ion-tab>\r\n        <ion-tab title=\"Statistics\" icon=\"ion-stats-bars\" ui-sref=\"tab.stats\">\r\n            <ion-nav-view name=\"stats\"></ion-nav-view>\r\n        </ion-tab>\r\n        <ion-tab title=\"Settings\" icon=\"ion-gear-b\" ui-sref=\"tab.settings\">\r\n            <ion-nav-view name=\"settings\"></ion-nav-view>\r\n        </ion-tab>\r\n    </ion-tabs>\r\n</ion-view>");
$templateCache.put("templates/account/login.html","<ion-view view-title=\"Login\">\n  <ion-content>\n    <div class=\"row\">\n      <div class=\"col\">\n        <form ng-submit=\"doLogin()\">\n          <div class=\"list\">\n            <label class=\"item item-input\">\n              <span class=\"input-label\">Email</span>\n              <input type=\"email\" ng-model=\"login.email\">\n            </label>\n            <label class=\"item item-input\">\n              <span class=\"input-label\">Password</span>\n              <input type=\"password\" ng-model=\"login.password\">\n            </label>\n            <label class=\"item\">\n              <button class=\"button button-block button-positive\" type=\"submit\">Log in</button>\n            </label>\n          </div>\n        </form>\n      </div>\n    </div>\n    <div class=\"row\" ng-show=\"login.hasError\">\n      <div class=\"col\">\n        <p>{{login.error}}</p>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col\">\n        <p>New to StaTracker?</p>\n      </div>\n      <div class=\"col\">\n        <button class=\"button button-calm\" ui-sref=\"register\">Register</button>\n      </div>\n    </div>\n    <!--<div class=\"row\">\n      <div class=\"col\">\n        <button class=\"button button-block button-assertive\">Login with Facebook</button>\n      </div>\n      <div class=\"col\">\n        <button class=\"button button-block button-energized\">Login with Google</button>\n      </div>\n    </div>-->\n  </ion-content>\n</ion-view>\n");
$templateCache.put("templates/account/my-bag.html","<ion-view view-title=\"My Bag\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=\"^.settings\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-clear\">Edit</button>\r\n    </ion-nav-buttons>\r\n    <ion-content>\r\n        <p>List of clubs for the logged in user, with a way to add, edit, remove clubs from the list. Each club also has editable attributes.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/account/preferences.html","<ion-view view-title=\"Preferences\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=\"^.settings\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-content>\r\n        <p>Preference settings governing app behavior</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/account/register.html","<ion-view view-title=\"Register\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=\"login\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-content>\r\n        <div class=\"row\">\r\n            <div class=\"col\">\r\n                <form ng-submit=\"doRegister()\" novalidate>\r\n                    <div class=\"list\">\r\n                        <label class=\"item item-input\">\r\n                            <span class=\"input-label\">Email</span>\r\n                            <input type=\"email\" name=\"email\" ng-model=\"registration.email\">\r\n                        </label>\r\n                        <label class=\"item item-input\">\r\n                            <span class=\"input-label\">Password</span>\r\n                            <input type=\"password\" name=\"password\" ng-model=\"registration.password\">\r\n                        </label>\r\n                        <label class=\"item item-input\">\r\n                            <span class=\"input-label\">Confirm Password</span>\r\n                            <input type=\"password\" name=\"confirm\" ng-model=\"registration.confirmPassword\">\r\n                        </label>\r\n                        <label class=\"item\">\r\n                            <button class=\"button button-block button-positive\" type=\"submit\">Register</button>\r\n                        </label>\r\n                    </div>\r\n                    <div class=\"row\" ng-show=\"registration.hasError\">\r\n                        <div class=\"col\">\r\n                            <p>{{ registration.error }}</p>\r\n                        </div>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </ion-content>\r\n</ion-view>\r\n");
$templateCache.put("templates/account/settings.html","<ion-view view-title=\"Settings\">\r\n    <ion-content>\r\n        <button class=\"button button-block\" ui-sref=\"^.my-bag\">My Clubs</button>\r\n        <button class=\"button button-block\" ui-sref=\"^.preferences\">Preferences</button>\r\n        <p>You are logged in as {{user.name}}</p>\r\n        <button class=\"button button-block\" ng-click=\"doLogout()\">Log Out</button>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/stats/approach.html","<ion-view view-title=\"Approach Shots\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon ion-navicon\" ng-click=\"openMenu()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear icon ion-funnel\" ng-click=\"openFilter()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-content has-bouncing=\"false\" nav-prev=\"^.teeball\" nav-next=\"^.shortgame\">\r\n        <p>Approach-only numerical statistics, trends, and heat map for the current period.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/stats/filter.html","<ion-popover-view>\r\n    <ion-content>\r\n        <h1>Filter Settings</h1>\r\n    </ion-content>\r\n</ion-popover-view>");
$templateCache.put("templates/stats/overall.html","<ion-view view-title=\"Overall\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon ion-navicon\" ng-click=\"openMenu()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear icon ion-funnel\" ng-click=\"openFilter()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-content has-bouncing=\"false\" nav-prev=\"^.shortgame\" nav-next=\"^.teeball\">\r\n        <p>Overall statistics and trends for the current period.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/stats/shortgame.html","<ion-view view-title=\"Short Game\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon ion-navicon\" ng-click=\"openMenu()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear icon ion-funnel\" ng-click=\"openFilter()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-content has-bouncing=\"false\" nav-prev=\"^.approach\" nav-next=\"^.overall\">\r\n        <p>Short-game-only numerical statistics and trends for the current period.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/stats/stats.html","<ion-view>\r\n    <ion-nav-view name=\"stats-detail\"></ion-nav-view>\r\n</ion-view>");
$templateCache.put("templates/stats/teeball.html","<ion-view view-title=\"Tee Shots\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon ion-navicon\" ng-click=\"openMenu()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear icon ion-funnel\" ng-click=\"openFilter()\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-content has-bouncing=\"false\" nav-prev=\"^.overall\" nav-next=\"^.approach\">\r\n        <p>Teeball-only numerical statistics, trends, and heat map for the current period.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/approach-summary.html","<ion-view view-title=\"Approach Shots\">\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-prev=\"^.teeball-summary\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>The green SVG image with all approach shots charted.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/approach.html","<ion-view view-title=\"Approach Shot\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear\" ng-click=\"gotoSummary()\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small\" ng-click=\"openHoleNav()\">{{hole.number}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-next=\"^.round-detail-shortgame\" nav-prev=\"^.round-detail-teeball\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>Custom SVG control to capture the approach shot for hole {{hole.number}}</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/create.html","<ion-view view-title=\"New Round\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear icon icon-left ion-ios7-arrow-back\" ui-sref=\"^.rounds\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-content>\r\n        <p>Form to create a new round and go directly to data-entry.</p>\r\n        <a class=\"button button-assertive\" ui-sref=\"^.round-detail-teeball({id: 400, hole: 1})\">Start</a>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/goto.html","<ion-popover-view>\r\n    <ion-pane>\r\n        <h1>Go To Specific Hole</h1>\r\n    </ion-pane>\r\n</ion-popover-view>");
$templateCache.put("templates/rounds/hole.html","<ion-view view-title=\"Round Detail\">\r\n    <ion-tabs class=\"tabs-top tabs-stable\">\r\n        <ion-tab title=\"Tee Ball\" ui-sref=\"tab.round-detail.teeball\">\r\n            <ion-nav-view name=\"teeball\"></ion-nav-view>\r\n        </ion-tab>\r\n        <ion-tab title=\"Approach\" ui-sref=\"tab.round-detail.approach\">\r\n            <ion-nav-view name=\"approach\"></ion-nav-view>\r\n        </ion-tab>\r\n        <ion-tab title=\"Short Game\" ui-sref=\"tab.round-detail.shortgame\">\r\n            <ion-nav-view name=\"shortgame\"></ion-nav-view>\r\n        </ion-tab>\r\n    </ion-tabs>\r\n</ion-view>");
$templateCache.put("templates/rounds/list.html","<ion-view view-title=\"My Rounds\">\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear icon ion-plus\" ui-sref=\"^.new-round\"></button>\r\n    </ion-nav-buttons>\r\n    <ion-content>\r\n        <ion-list>\r\n            <ion-item ui-sref=\"tab.round-summary({id: 100})\">\r\n                6/2/2015: Bunker Hills North to East Blue\r\n            </ion-item>\r\n            <ion-item ui-sref=\"tab.round-summary({id: 200})\">\r\n                6/5/2015: Bunker Hills North League\r\n            </ion-item>\r\n            <ion-item ui-sref=\"tab.round-summary({id: 300})\">\r\n                6/9/2015: Bunker Hills East to West White\r\n            </ion-item>\r\n        </ion-list>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/round-summary.html","<ion-view view-title=\"Round Overview\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear\" ui-sref=\"^.rounds\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small button-clear\" ng-click=\"gotoDetails()\">Details</button>\r\n    </ion-nav-buttons>\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-next=\"^.teeball-summary\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>Controls to enter the basic round statistics (fairways hit, gir, putts, etc.)</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/shortgame.html","<ion-view view-title=\"Short Game\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear\" ng-click=\"gotoSummary()\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small\" ng-click=\"openHoleNav()\">{{hole.number}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-next=\"^.round-detail-teeball\" nav-prev=\"^.round-detail-approach\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>Controls to capture short game information for hole {{hole.number}}</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/teeball-summary.html","<ion-view view-title=\"Tee Shots\">\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-next=\"^.approach-summary\" nav-prev=\"^.round-summary\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>The fairway SVG image with all tee shots charted.</p>\r\n    </ion-content>\r\n</ion-view>");
$templateCache.put("templates/rounds/teeball.html","<ion-view view-title=\"Tee Shot\">\r\n    <ion-nav-buttons side=\"primary\">\r\n        <button class=\"button button-small button-clear\" ng-click=\"gotoSummary()\">Back</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"secondary\">\r\n        <button class=\"button button-small\" ng-click=\"openHoleNav()\">{{hole.number}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-content scroll=\"false\" has-bouncing=\"false\" nav-next=\"^.round-detail-approach\" nav-prev=\"^.round-detail-shortgame\">\r\n        <p>Round id: {{ round.id }}</p>\r\n        <p>Custom SVG control to capture tee shot for hole {{hole.number}}</p>\r\n    </ion-content>\r\n</ion-view>");}]);
statracker.controller('AccountController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

        $scope.user = accountService.user();

        $scope.doLogout = function () {
            accountService.logout();
            $state.go('login');
        }
    }
]);

statracker.factory('accountService', [
    '$http',
    'store',
    'jwtHelper',
    function ($http, store, jwtHelper) {
        'use strict';

        var user = {
                authenticated: false,
                id: '',
                name: '',
                email: ''
            },
            serviceBase = 'https://localhost:44300/', //https://statsapi.azurewebsites.net/
            clientId = '73788e966f4c4c289a3a8f12f9aae744'; //TODO: move to config outside source control

        var login = function (credentials) {
            var data = 'grant_type=password&username=' + credentials.email + '&password=' + credentials.password + '&client_id=' + clientId;
            return $http({
                url: serviceBase + 'token',
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
            })
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(serviceBase + 'api/account/logout');
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
                url: serviceBase + 'api/account/register',
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
                    url: serviceBase + 'token',
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

angular.module('statracker').directive('compareTo', [
    function () {
        'use strict';

        return {
            require: 'ngModel',
            scope: {
                otherValue: '=compareTo'
            },
            link: function(scope, elem, attrs, ctrl) {
                ctrl.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherValue;
                };
                scope.$watch("otherValue", function() {
                    ctrl.$validate();
                });
            }
        }
    }
]);
statracker.controller('LoginController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

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
                .success(function (response) {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
                    $scope.login.hasError = true;
                    $scope.login.error = error.error_description;
                });
        }
    }
]);

angular.module('statracker').controller('MyBagController', [
    '$scope',
    function ($scope) {
        'use strict';

    }
]);
angular.module('statracker').controller('PreferencesController', [
    '$scope',
    function ($scope) {
        'use strict';

    }
]);
angular.module('statracker').controller('RegisterController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

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
                    .success(function (response) {
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
        }
    }
]);

angular.module('statracker').controller('StatsController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        'use strict';

        if ($state.is('tab.stats')) {
            $state.go('.overall');
        }
    }
]);
angular.module('statracker').controller('CreateRoundController', [
    '$scope',
    function ($scope) {
        'use strict';

    }
]);

angular.module('statracker').controller('HoleController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        'use strict';

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
angular.module('statracker').controller('ListRoundsController', [
    '$scope',
    function ($scope) {
        'use strict';

    }
]);

angular.module('statracker').directive('navNext', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        'use strict';

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
                            if ($state.params.hole !== undefined && $state.params.hole == 3) {
                                $state.params.hole = 1;
                            } else {
                                $state.params.hole += 1;
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        }
    }
]);

angular.module('statracker').directive('navPrev', [
    '$state',
    '$ionicGesture',
    '$ionicViewSwitcher',
    function ($state, $ionicGesture, $ionicViewSwitcher) {
        'use strict';

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
                            if ($state.params.hole !== undefined && $state.params.hole == 1) {
                                $state.params.hole = 3;
                            } else {
                                $state.params.hole -= 1;
                            }
                        }
                        $state.go(destination, $state.params, {location: 'replace'});
                    }
                }, elem);
            }
        }
    }
]);

angular.module('statracker').controller('RoundController', [
    '$scope',
    '$state',
    function ($scope, $state) {
        'use strict';

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

statracker.config([
    '$httpProvider',
    'jwtInterceptorProvider',
    function ($httpProvider, jwtInterceptorProvider) {
        'use strict';

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
    })
}]);

statracker.config([
    '$httpProvider',
    function ($httpProvider) {
        'use strict';

        //broadcast an event with the start and end of each http call
        $httpProvider.interceptors.push(function($rootScope, $q) {
            return {
                request: function(config) {
                    $rootScope.$broadcast('loading:show')
                    return config
                },
                response: function(response) {
                    $rootScope.$broadcast('loading:hide')
                    return response
                },
                responseError: function (rejection) {
                    $rootScope.$broadcast('loading:hide')
                    //TODO: toast a message
                    return $q.reject(rejection);
                }
            }
        });
    }
    //register listeners to the http start and end events we configured above
]).run(['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: 'Loading...', noBackdrop: true}) //TODO: something nicer
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide()
    });
}]);

statracker.config([
    '$ionicConfigProvider',
    function ($ionicConfigProvider) {
        'use strict';

        //$ionicConfigProvider.templates.maxPrefetch(0);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-ios7-arrow-left');
    }
]);

statracker.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';

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

angular.module('statracker').run([
    '$rootScope',
    '$location',
    function ($rootScope, $location) {
        'use strict';

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            console.debug(toState);
            console.debug(toParams);
        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState) {
            console.error(unfoundState);
            console.info(fromState);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.error(error);
            console.info(toState);
            console.info(toParams);
        });
    }
]);