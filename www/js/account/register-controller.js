angular.module('statracker').controller('RegisterController', [
    '$scope',
    '$state',
    'accountService',
    function ($scope, $state, accountService) {
        'use strict';

        $scope.registration = {
            email: '',
            password: '',
            confirmPassword: '',
            hasError: false,
            error: ''
        };

        $scope.doRegister = function () {
            $scope.registration.hasError = false;
            $scope.registration.error = '';
            if ($scope.validate()) {
                accountService.register($scope.registration)
                    .success(function () {
                        accountService.login($scope.registration).then(function () {
                            $state.go('tab.rounds');
                        });
                    })
                    .error(function (error) {
                        $scope.registration.hasError = true;
                        if (error.error_description) {
                            $scope.registration.error = error.error_description;
                        } else if (error.modelState) {
                            $scope.registration.error = error.modelState;
                        } else {
                            $scope.registration.error = error;
                        }
                    });
            }
        };

        $scope.validate = function () {
            if ($scope.registration.email === '') {
                $scope.registration.hasError = true;
                $scope.registration.error = 'An email address is required';
                return false;
            }
            if ($scope.registration.password === '') {
                $scope.registration.hasError = true;
                $scope.registration.error = 'A password is required';
                return false;
            }
            if ($scope.registration.password !== $scope.registration.confirmPassword) {
                $scope.registration.hasError = true;
                $scope.registration.error = 'The passwords do not match';
                return false;
            }
            return true;
        };
    }
]);
