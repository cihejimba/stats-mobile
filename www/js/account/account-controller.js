'use strict';

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
