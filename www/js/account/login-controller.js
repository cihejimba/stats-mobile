statracker.controller('LoginController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

        $scope.login = {
            email: '',
            password: '',
            hasError: false,
            error: ''
        };

        $scope.doLogin = function () {
            $scope.login.hasError = false;
            $scope.login.error = '';
            accountService.login($scope.login)
                .success(function (response) {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
                    $scope.login.hasError = true;
                    $scope.login.error = error.error_description;
                });
        }
    }
]);
