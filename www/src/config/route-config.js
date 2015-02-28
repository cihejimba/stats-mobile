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

            .state('tab.user', {
                url: '/user',
                views: {
                    'settings': {
                        templateUrl: 'src/account/user-page.html'
                    }
                }
            })
            .state('tab.course-list', {
                url: '/course-list',
                views: {
                    'settings': {
                        templateUrl: 'src/account/course-list-page.html',
                        controller: 'CourseListController as vm',
                        resolve: {
                            userData: ['userDataService', function(userDataService) {
                                return userDataService.loadUserData();
                            }]
                        }
                    }
                }
            })
            .state('tab.course-detail', {
                url: '/course-detail',
                params: {
                    key: 0
                },
                views: {
                    'settings': {
                        templateUrl: 'src/account/course-detail-page.html'
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
            .state('tab.club-detail', {
                url: '/club-detail',
                params: {
                    club: {}
                },
                views: {
                    'settings': {
                        templateUrl: 'src/account/club-detail-page.html'
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
                views: {
                    'rounds': {
                        templateUrl: 'src/rounds/round-summary-page.html'
                    }
                }
            })
            .state('tab.round-detail-teeball', {
                url: '/round-detail-teeball',
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
                        templateUrl: 'src/stats/stats-page.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/rounds');
    }
]);
