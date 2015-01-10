statracker.directive('login', [function () {
    return {
        scope: {},
        templateUrl: 'js/account/login.html',
        replace: true,
        bindToController: true,
        controller: 'loginController',
        controllerAs: 'ctrl'
    };
}]).controller('loginController', ['$state', 'accountService', function ($state, accountService) {

    this.credentials = {
        email: '',
        password: '',
        hasError: false,
        error: ''
    };

    this.doLogin = function () {
        this.credentials.hasError = false;
        this.credentials.error = '';
        accountService.login(this.credentials)
            .success(function () {
                $state.go('tab.rounds');
            })
            .error(function (error) {
                this.credentials.hasError = true;
                this.credentials.error = error.error_description;
            });
    };
}]);
