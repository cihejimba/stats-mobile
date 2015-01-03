angular.module('statracker').controller('RegisterController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

        $scope.registration = {
            email: '',
            password: '',
            confirmPassword: ''
        };

        $scope.doRegister = function () {
            accountService.register($scope.registration).then(function () {
                accountService.login($scope.registration).then(function () {
                    $state.go('tab.rounds');
                });
            });
        }
    }
]);
