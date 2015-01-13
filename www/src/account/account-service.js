statracker.factory('accountService', [
    '$http',
    'localStore',
    'jwtHelper',
    'apiUrl',
    'clientId',
    function ($http, localStore, jwtHelper, apiUrl, clientId) {

        var user = {
                authenticated: false,
                id: '',
                name: '',
                email: ''
            };

        var login = function (credentials) {
            var data = 'grant_type=password&username=' + credentials.email + '&password=' + credentials.password + '&client_id=' + clientId;
            return $http({
                url: apiUrl + 'token',
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
                localStore.set('user', user);
                localStore.set('access_token', response.access_token);
                localStore.set('refresh_token', response.refresh_token);
            })
            .error(function () {
                logout();
            });
        };

        var logout = function () {
            if (user.authenticated) {
                $http.post(apiUrl + 'api/account/logout');
            }
            localStore.remove('access_token');
            localStore.remove('refresh_token');
            localStore.remove('user');
            user = {};
            return user;
        };

        var register = function (registration) {
            logout();
            return $http({
                url: apiUrl + 'api/account/register',
                method: 'POST',
                data: registration,
                skipAuthorization: true
            });
        };

        var getUser = function () {
            var user = localStore.get('user');
            return (user === undefined || user === null) ? undefined :user;
        };

        var refresh = function () {
            var token = localStore.get('refresh_token'),
                data = 'grant_type=refresh_token&refresh_token=' + token + '&client_id=' + clientId;
            if (token) {
                return $http({
                    url: apiUrl + 'token',
                    method: 'POST',
                    skipAuthorization: true,
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (response) {
                    localStore.set('access_token', response.access_token);
                    localStore.set('refresh_token', response.refresh_token);
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
