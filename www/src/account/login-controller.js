statracker.controller('LoginController', [
    '$state',
    'accountService',
    function ($state, accountService) {

        this.credentials = {
            email: '',
            password: '',
            hasError: false,
            error: ''
        };

        this.canLogin = function () {
            return (
                this.credentials.email && //email will be undefined until is looks valid
                this.credentials.email.length > 0 &&
                this.credentials.password &&
                this.credentials.password.length > 0
            );
        };

        this.doLogin = function () {
            var that = this;
            that.credentials.hasError = false;
            that.credentials.error = '';
            accountService.login(this.credentials)
                .success(function () {
                    $state.go('tab.rounds');
                })
                .error(function (error) {
                    that.credentials.hasError = true;
                    if (error === null) {
                        that.credentials.error = 'Cannot reach the StaTracker authorization server';
                    } else {
                        that.credentials.error = error.error_description;
                    }
                });
        };
    }
]);
