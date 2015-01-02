statracker.config([
    '$httpProvider',
    'jwtInterceptorProvider',
    function ($httpProvider, jwtInterceptorProvider) {
        'use strict';

        //the tokenGetter function returns a bearer token, which the angular-jwt
        //interceptor will attach to the request header on every request (unless
        //we tell it not to)
        jwtInterceptorProvider.tokenGetter = ['store', 'jwtHelper', 'accountService', function(store, jwtHelper, accountService) {
            var access_token = store.get('access_token'),
                refresh_token = store.get('refresh_token');

            //user is logged out, so we have no bearer token to attach to the request
            if (!access_token || !refresh_token) {
                return null;
            }

            //if the access token has expired - we use the refresh token to get a new one
            if (jwtHelper.isTokenExpired(access_token)) {
                return accountService.refresh()
                    .then(function (response) {
                        var new_token = response.data.access_token;
                        store.set('access_token', new_token);
                        return new_token;
                    });
            } else {
                return access_token;
            }

        }];
        $httpProvider.interceptors.push('jwtInterceptor');
    }
]).run(['$rootscope', '$state', 'accountService', function ($rootscope, $state, accountService) {
    $rootscope.$on('stateChangeStart', function (event, toState) {
        if (toState.data.secure && !accountService.user().authenticated) {
            event.preventDefault();
            $state.go('login');
        }
    })
}]);
