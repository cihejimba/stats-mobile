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
