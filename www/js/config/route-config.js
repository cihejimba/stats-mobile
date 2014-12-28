angular.module('statracker').config([
    '$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        'use strict';

        $ionicConfigProvider.tabs.position('bottom');

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'HomeController'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/login.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/register.html',
                        controller: 'RegisterController'
                    }
                }
            })

            .state('app.preferences', {
                url: '/preferences',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/preferences.html',
                        controller: 'PreferencesController'
                    }
                }
            })

            .state('app.my-bag', {
                url: '/my-bag',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/my-bag.html',
                        controller: 'MyBagController'
                    }
                }
            })

            .state('app.create-round', {
                url: '/create-round',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/create.html',
                        controller: 'CreateRoundController'
                    }
                }
            })

            .state('app.list-rounds', {
                url: '/list-rounds',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/list.html',
                        controller: 'ListRoundsController'
                    }
                }
            })

            .state('app.round', {
                url: '/round',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/round.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('app.round.summary', {
                url: '/round-summary',
                views: {
                    'round-summary': {
                        templateUrl: 'templates/rounds/round-summary.html'
                    }
                }
            })
            .state('app.round.teeball-summary', {
                url: '/teeball-summary',
                views: {
                    'teeball-summary': {
                        templateUrl: 'templates/rounds/teeball-summary.html'
                    }
                }
            })
            .state('app.round.approach-summary', {
                url: '/approach-summary',
                views: {
                    'approach-summary': {
                        templateUrl: 'templates/rounds/approach-summary.html'
                    }
                }
            })

            .state('app.hole', {
                url: '/hole',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/hole.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('app.hole.teeball', {
                url: '/teeball',
                views: {
                    'teeball': {
                        templateUrl: 'templates/rounds/teeball.html'
                    }
                }
            })
            .state('app.hole.approach', {
                url: '/approach',
                views: {
                    'approach': {
                        templateUrl: 'templates/rounds/approach.html'
                    }
                }
            })
            .state('app.hole.shortgame', {
                url: '/shortgame',
                views: {
                    'shortgame': {
                        templateUrl: 'templates/rounds/shortgame.html'
                    }
                }
            })

            .state('app.round-stats', {
                url: '/round-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/round-stats.html',
                        controller: 'RoundStatsController'
                    }
                }
            })
            .state('app.round-stats.summary', {
                url: '/round-stats-summary',
                views: {
                    'round-stats-summary': {
                        templateUrl: 'templates/stats/round-stats-summary.html'
                    }
                }
            })
            .state('app.round-stats.trends', {
                url: '/round-stats-trends',
                views: {
                    'round-stats-trends': {
                        templateUrl: 'templates/stats/round-stats-trends.html'
                    }
                }
            })

            .state('app.teeball-stats', {
                url: '/teeball-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/teeball-stats.html',
                        controller: 'TeeballStatsController'
                    }
                }
            })
            .state('app.teeball-stats.summary', {
                url: '/teeball-stats-summary',
                views: {
                    'teeball-stats-summary': {
                        templateUrl: 'templates/stats/teeball-stats-summary.html'
                    }
                }
            })
            .state('app.teeball-stats.map', {
                url: '/teeball-stats-map',
                views: {
                    'teeball-stats-map': {
                        templateUrl: 'templates/stats/teeball-stats-map.html'
                    }
                }
            })
            .state('app.teeball-stats.trends', {
                url: '/teeball-stats-trends',
                views: {
                    'teeball-stats-trends': {
                        templateUrl: 'templates/stats/teeball-stats-trends.html'
                    }
                }
            })

            .state('app.approach-stats', {
                url: '/approach-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/approach-stats.html',
                        controller: 'ApproachStatsController'
                    }
                }
            })
            .state('app.approach-stats.summary', {
                url: '/approach-stats-summary',
                views: {
                    'approach-stats-summary': {
                        templateUrl: 'templates/stats/approach-stats-summary.html'
                    }
                }
            })
            .state('app.approach-stats.map', {
                url: '/approach-stats-map',
                views: {
                    'approach-stats-map': {
                        templateUrl: 'templates/stats/approach-stats-map.html'
                    }
                }
            })
            .state('app.approach-stats.trends', {
                url: '/approach-stats-trends',
                views: {
                    'approach-stats-trends': {
                        templateUrl: 'templates/stats/approach-stats-trends.html'
                    }
                }
            })

            .state('app.shortgame-stats', {
                url: '/shortgame-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/shortgame-stats.html',
                        controller: 'ShortgameStatsController'
                    }
                }
            })
            .state('app.shortgame-stats.summary', {
                url: '/shortgame-stats-summary',
                views: {
                    'shortgame-stats-summary': {
                        templateUrl: 'templates/stats/shortgame-stats-summary.html'
                    }
                }
            })
            .state('app.shortgame-stats.trends', {
                url: '/shortgame-stats-trends',
                views: {
                    'shortgame-stats-trends': {
                        templateUrl: 'templates/stats/shortgame-stats-trends.html'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    }
]);
