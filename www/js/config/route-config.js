angular.module('statracker').config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';

        $stateProvider

            .state('home', {
                url: '/',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeController'
                    }
                }
            })

            .state('login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/login.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/register.html',
                        controller: 'RegisterController'
                    }
                }
            })

            .state('preferences', {
                url: '/preferences',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/preferences.html',
                        controller: 'PreferencesController'
                    }
                }
            })

            .state('my-bag', {
                url: '/my-bag',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/my-bag.html',
                        controller: 'MyBagController'
                    }
                }
            })

            .state('create-round', {
                url: '/create-round',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/create.html',
                        controller: 'CreateRoundController'
                    }
                }
            })

            .state('list-rounds', {
                url: '/list-rounds',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/list.html',
                        controller: 'ListRoundsController'
                    }
                }
            })

            .state('round', {
                url: '/round',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/round.html',
                        controller: 'RoundController'
                    }
                }
            })
            .state('round.summary', {
                url: '/round/summary',
                views: {
                    'round-summary': {
                        templateUrl: 'templates/rounds/round-summary.html'
                    }
                }
            })
            .state('round.teeball-summary', {
                url: '/round/teeball-summary',
                views: {
                    'teeball-summary': {
                        templateUrl: 'templates/rounds/teeball-summary.html'
                    }
                }
            })
            .state('round.approach-summary', {
                url: '/round/approach-summary',
                views: {
                    'approach-summary': {
                        templateUrl: 'templates/rounds/approach-summary.html'
                    }
                }
            })

            .state('hole', {
                url: '/hole',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/hole.html',
                        controller: 'HoleController'
                    }
                }
            })
            .state('hole.teeball', {
                url: '/hole/teeball',
                views: {
                    'teeball': {
                        templateUrl: 'templates/rounds/teeball.html'
                    }
                }
            })
            .state('hole.approach', {
                url: '/hole/approach',
                views: {
                    'approach': {
                        templateUrl: 'templates/rounds/approach.html'
                    }
                }
            })
            .state('hole.shortgame', {
                url: '/hole/shortgame',
                views: {
                    'shortgame': {
                        templateUrl: 'templates/rounds/shortgame.html'
                    }
                }
            })

            .state('round-stats', {
                url: '/round-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/round-stats.html',
                        controller: 'RoundStatsController'
                    }
                }
            })
            .state('round-stats.summary', {
                url: '/round-stats/summary',
                views: {
                    'round-stats-summary': {
                        templateUrl: 'templates/stats/round-stats-summary.html'
                    }
                }
            })
            .state('round-stats.trends', {
                url: '/round-stats/trends',
                views: {
                    'round-stats-trends': {
                        templateUrl: 'templates/stats/round-stats-trends.html'
                    }
                }
            })

            .state('teeball-stats', {
                url: '/teeball-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/teeball-stats.html',
                        controller: 'TeeballStatsController'
                    }
                }
            })
            .state('teeball-stats.summary', {
                url: '/teeball-stats/summary',
                views: {
                    'teeball-stats-summary': {
                        templateUrl: 'templates/stats/teeball-stats-summary.html'
                    }
                }
            })
            .state('teeball-stats.map', {
                url: '/teeball-stats/map',
                views: {
                    'teeball-stats-map': {
                        templateUrl: 'templates/stats/teeball-stats-map.html'
                    }
                }
            })
            .state('teeball-stats.trends', {
                url: '/teeball-stats/trends',
                views: {
                    'teeball-stats-trends': {
                        templateUrl: 'templates/stats/teeball-stats-trends.html'
                    }
                }
            })

            .state('approach-stats', {
                url: '/approach-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/approach-stats.html',
                        controller: 'ApproachStatsController'
                    }
                }
            })
            .state('approach-stats.summary', {
                url: '/approach-stats/summary',
                views: {
                    'approach-stats-summary': {
                        templateUrl: 'templates/stats/approach-stats-summary.html'
                    }
                }
            })
            .state('approach-stats.map', {
                url: '/approach-stats/map',
                views: {
                    'approach-stats-map': {
                        templateUrl: 'templates/stats/approach-stats-map.html'
                    }
                }
            })
            .state('approach-stats.trends', {
                url: '/approach-stats/trends',
                views: {
                    'approach-stats-trends': {
                        templateUrl: 'templates/stats/approach-stats-trends.html'
                    }
                }
            })

            .state('shortgame-stats', {
                url: '/shortgame-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/shortgame-stats.html',
                        controller: 'ShortgameStatsController'
                    }
                }
            })
            .state('shortgame-stats.summary', {
                url: '/shortgame-stats/summary',
                views: {
                    'shortgame-stats-summary': {
                        templateUrl: 'templates/stats/shortgame-stats-summary.html'
                    }
                }
            })
            .state('shortgame-stats.trends', {
                url: '/shortgame-stats/trends',
                views: {
                    'shortgame-stats-trends': {
                        templateUrl: 'templates/stats/shortgame-stats-trends.html'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    }
]);
