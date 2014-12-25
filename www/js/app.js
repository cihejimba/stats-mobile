// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('statracker', ['ionic'])

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
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('home', {
                url: '/',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })

            .state('preferences', {
                url: '/preferences',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/preferences.html',
                        controller: 'PreferencesCtrl'
                    }
                }
            })

            .state('my-bag', {
                url: '/my-bag',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account/my-bag.html',
                        controller: 'MyBagCtrl'
                    }
                }
            })

            .state('create-round', {
                url: '/create-round',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/create.html',
                        controller: 'CreateRoundCtrl'
                    }
                }
            })

            .state('list-rounds', {
                url: '/list-rounds',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/list.html',
                        controller: 'ListRoundsCtrl'
                    }
                }
            })
            
            .state('round', {
                url: '/round',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rounds/round.html',
                        controller: 'RoundCtrl'
                    }
                }
            })
            .state('round.summary', {
                url: '/round-summary',
                views: {
                    'round-summary': {
                        templateUrl: 'templates/rounds/round-summary.html'
                    }
                }
            })
            .state('round.teeball', {
                url: '/teeball-summary',
                views: {
                    'round-summary': {
                        templateUrl: 'templates/rounds/teeball-summary.html'
                    }
                }
            })
            .state('round.approach', {
                url: '/approach-summary',
                views: {
                    'round-summary': {
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
                        controller: 'HoleCtrl'
                    }
                }
            })
            .state('hole.teeball', {
                url: '/teeball',
                views: {
                    'teeball': {
                        templateUrl: 'templates/rounds/teeball.html'
                    }
                }
            })
            .state('hole.approach', {
                url: '/approach',
                views: {
                    'approach': {
                        templateUrl: 'templates/rounds/approach.html'
                    }
                }
            })
            .state('hole.shortgame', {
                url: '/shortgame',
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
                        templateUrl: 'templates/stats/round.html',
                        controller: 'RoundStatsCtrl'
                    }
                }
            })
            .state('round-stats.overall', {
                url: '/round-stats-overall',
                views: {
                    'stats-overall': {
                        templateUrl: 'templates/stats/round-stats.html'
                    }
                }
            })
            .state('round-stats.trends', {
                url: '/round-stats-trends',
                views: {
                    'stats-trends': {
                        templateUrl: 'templates/stats/round-trends.html'
                    }
                }
            })

            .state('teeball-stats', {
                url: '/teeball-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/teeball.html',
                        controller: 'TeeballStatsCtrl'
                    }
                }
            })
            .state('teeball-stats.overall', {
                url: '/teeball-stats-overall',
                views: {
                    'stats-teeball': {
                        templateUrl: 'templates/stats/teeball-stats.html'
                    }
                }
            })
            .state('teeball-stats.map', {
                url: '/teeball-stats-map',
                views: {
                    'stats-teeball-map': {
                        templateUrl: 'templates/stats/teeball-map.html'
                    }
                }
            })
            .state('teeball-stats.trends', {
                url: '/teeball-stats-trends',
                views: {
                    'stats-teeball-trends': {
                        templateUrl: 'templates/stats/teeball-trends.html'
                    }
                }
            })

            .state('approach-stats', {
                url: '/approach-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/approach.html',
                        controller: 'ApproachStatsCtrl'
                    }
                }
            })
            .state('approach-stats.overall', {
                url: '/approach-stats-overall',
                views: {
                    'stats-approach': {
                        templateUrl: 'templates/stats/approach-stats.html'
                    }
                }
            })
            .state('approach-stats.map', {
                url: '/approach-stats-map',
                views: {
                    'stats-approach-map': {
                        templateUrl: 'templates/stats/approach-map.html'
                    }
                }
            })
            .state('approach-stats.trends', {
                url: '/approach-stats-trends',
                views: {
                    'stats-approach-trends': {
                        templateUrl: 'templates/stats/approach-trends.html'
                    }
                }
            })

            .state('shortgame-stats', {
                url: '/shortgame-stats',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/stats/shortgame.html',
                        controller: 'ShortgameStatsCtrl'
                    }
                }
            })
            .state('shortgame-stats.overall', {
                url: '/shortgame-stats-overall',
                views: {
                    'stats-shortgame': {
                        templateUrl: 'templates/stats/shortgame-stats.html'
                    }
                }
            })
            .state('shortgame-stats.trends', {
                url: '/shortgame-stats-trends',
                views: {
                    'stats-shortgame-trends': {
                        templateUrl: 'templates/stats/shortgame-trends.html'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    });
