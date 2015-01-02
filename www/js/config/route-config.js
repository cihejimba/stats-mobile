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
                        templateUrl: 'templates/account/settings.html'
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
