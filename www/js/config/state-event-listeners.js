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