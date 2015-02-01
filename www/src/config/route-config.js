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
