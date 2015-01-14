statracker.controller('LoginController', [
    '$state',
    'accountService',
    function ($state, accountService) {

        var vm = this;

        vm.credentials = {
            email: '',
            password: '',
            hasError: false,
            error: ''
        };

        vm.canLogin = function () {
            return (
                vm.credentials.email && //email will be undefined until is looks valid
                vm.credentials.email.length > 0 &&
                vm.credentials.password &&
                vm.credentials.password.length > 0
            );
        };

        this.doLogin = function () {
            vm.credentials.hasError = false;
            vm.credentials.error = '';
            accountService.login(this.credentials)
                .success(function () {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
                    vm.credentials.hasError = true;
                    if (error === null) {
                        vm.credentials.error = 'Cannot reach the StaTracker authorization server';
                    } else {
                        vm.credentials.error = error.error_description;
                    }
                });
        };
    }
]);
