statracker.factory('accountService', [
    '$http',
    'store',
    'jwtHelper',
    function ($http, store, jwtHelper) {
        'use strict';

        var user = {
                authenticated: false,
                id: '',
                name: '',
                email: ''
            },
            serviceBase = 'https://localhost:44300/', //https://statsapi.azurewebsites.net/
            clientId = '73788e966f4c4c289a3a8f12f9aae744'; //TODO: move to config outside source control

        var login = function (credentials) {
            var data = 'grant_type=password&username=' + credentials.email + '&password=' + credentials.password + '&client_id=' + clientId;
            return $http({
                url: serviceBase + 'token',
                method: 'POST',
                data: data,
                skipAuthorization: true,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (response) {
                //decode the token
                var claims = jwtHelper.decodeToken(response.access_token);
                //populate our user object
                user.authenticated = true;
                user.id = claims.nameid;
                user.name = claims.sub; //TODO: would like to separate these, maybe?
                user.email = claims.sub;
                //store the tokens
                store.set('user', user);
                store.set('access_token', response.access_token);
                store.set('refresh_token', response.refresh_token);
            })
            .error(function () {
                logout();
            })
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(serviceBase + 'api/account/logout');
            }
            store.remove('access_token');
            store.remove('refresh_token');
            store.remove('user');
            user = {};
            return user;
        };

        var register = function (registration) {
            logout();
            return $http({
                url: serviceBase + 'api/account/register',
                method: 'POST',
                data: registration,
                skipAuthorization: true
            });
        };

        var getUser = function () {
            var user = store.get('user');
            return (user === undefined || user === null) ? undefined :user;
        };

        var refresh = function () {
            var token = store.get('refresh_token'),
                data = 'grant_type=refresh_token&refresh_token=' + token + '&client_id=' + clientId;
            if (token) {
                return $http({
                    url: serviceBase + 'token',
                    method: 'POST',
                    skipAuthorization: true,
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (response) {
                    store.set('access_token', response.access_token);
                    store.set('refresh_token', response.refresh_token);
                })
                .error(function () {
                    logout();
                });
            }
        };

        return {
            login: login,
            logout: logout,
            register: register,
            user: getUser,
            refresh: refresh
        };
    }
]);
