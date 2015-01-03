statracker.controller('LoginController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

        $scope.login = {
            email: '',
            password: ''
        };

        $scope.doLogin = function () {
            accountService.login($scope.login).then(function () {
                $state.go('tab.rounds');
            });
        }
    }
]);
