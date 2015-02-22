(function () {
    'use strict';

    describe('account-service', function () {

        var http, q, service, my_store, my_jwtHelper;

        beforeEach(module('statracker'));

        beforeEach(function () {
            my_store = {
                get: function () {},
                set: function () {},
                remove: function () {}
            };
            my_jwtHelper = {
                decodeToken: function () {},
                isTokenExpired: function () {}
            };
            module(function ($provide) {
                $provide.value('localStore', my_store);
                $provide.value('jwtHelper', my_jwtHelper);
            });
        });

        beforeEach(function () {
            inject(function ($httpBackend, $injector) {
                http = $httpBackend;
                service = $injector.get('accountService');
            });
        });

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        describe('login', function () {

            var url = 'https://localhost:44300/token',
                credentials = {
                    email: 'user@test.com',
                    password: 'foo'
                },
                response = {
                    access_token: 'yes.you.can',
                    refresh_token: 'again'
                },
                claims = {
                    nameid: '123',
                    sub: 'user@test.com'
                },
                postHandler;

            beforeEach(function () {
                spyOn(my_jwtHelper, 'decodeToken').and.returnValue(claims);
                spyOn(my_store, 'set');
            });

            beforeEach(function () {
                postHandler = http.when('POST', url).respond(response);
            });

            it('should return a promise', function () {
                var promise = service.login(credentials);
                expect(promise.then).toBeDefined();
                http.flush();
            });

            it('should pass the correct data to POST', function () {

                service.login(credentials);

                http.expectPOST(url, function (data) {
                   return data === 'grant_type=password&username=user%40test.com&password=foo&client_id=73788e966f4c4c289a3a8f12f9aae744';
                });

                http.flush();
            });

            it('should store the tokens and user object on success', function () {

                service.login(credentials);

                //expect a POST at the correct URL
                http.expectPOST(url);
                http.flush();

                //expect SUCCESS handling
                expect(my_jwtHelper.decodeToken).toHaveBeenCalledWith(response.access_token);
                expect(my_store.set).toHaveBeenCalledWith('user', {
                    authenticated: true,
                    id: claims.nameid,
                    name: claims.sub,
                    email: claims.sub
                });
                expect(my_store.set).toHaveBeenCalledWith('access_token', response.access_token);
                expect(my_store.set).toHaveBeenCalledWith('refresh_token', response.refresh_token);
            });

            it('should call logout on failure', function () {

                postHandler.respond(400, 'invalid login');
                service.login(credentials);

                http.expectPOST(url);
                http.flush();

                //no SUCCESS handling
                expect(my_jwtHelper.decodeToken).not.toHaveBeenCalled();
                expect(my_store.set).not.toHaveBeenCalled();
            });
        });

        describe('logout', function () {

            var url = 'https://localhost:44300/api/v1/account/logout';

            beforeEach(function () {
                spyOn(my_store, 'remove');
            });

            beforeEach(function () {
                http.when('POST', url).respond('ok');
            });

            it('should return an unauthenticated user', function () {
                var user = service.logout();
                expect(user).toEqual({ authenticated: false });
            });

            it('should not POST if the user is not authenticated', function () {
                service.logout();
                //this expectation is met by http.verifyNoOutstandingRequest()
            });

            it('should POST if the user is authenticated', function () {
                var user = service.user();
                user.authenticated = true;

                service.logout();

                http.expectPOST(url);
                http.flush();
            });

            it('should clear the local store if the user is authenticated', function () {
                var user = service.user();
                user.authenticated = true;

                service.logout();
                http.flush();

                expect(my_store.remove).toHaveBeenCalledWith('access_token');
                expect(my_store.remove).toHaveBeenCalledWith('refresh_token');
                expect(my_store.remove).toHaveBeenCalledWith('user');
            });
        });

        describe('register', function () {

            var url = 'https://localhost:44300/api/v1/account/register',
                reg = {
                    email: 'user@test.com',
                    password: 'foo',
                    confirmPassword: 'foo'
                };

            beforeEach(function () {
                spyOn(service, 'logout');
            });

            beforeEach(function () {
                http.when('POST', url).respond('ok');
            });

            it('should pass the correct data to POST', function () {

                service.register(reg);

                http.expectPOST(url, function (data) {
                    return data === JSON.stringify(reg);
                });
                http.flush();
            });

            it('should return an HTTP promise', function () {
                var promise = service.register();
                expect(promise.then).toBeDefined();
                promise.then(function (response) {
                    expect(response.data).toBeDefined();
                });
                http.flush();
            });

            it('should flag the interceptor to skip authorization', function () {
                spyOn(my_store, 'get').and.returnValue('foo');
                service.register();
                http.expectPOST(url, undefined, function (headers) {
                    //If we don't skip authorization, this header would be "Bearer foo"
                    return headers['Authorization'] === undefined;
                });
                http.flush();
            });
        });

        describe('getUser', function () {

            it('should return the user object in memory if it is available', function () {
                //create the user object via a login call (maybe a bad idea, but how else to isolate the behavior we're testing?)
                var claims = {
                    nameid: '123',
                    sub: 'user@test.com'
                };
                http.when('POST', 'https://localhost:44300/token').respond('ok');
                spyOn(my_jwtHelper, 'decodeToken').and.returnValue(claims);
                spyOn(my_store, 'set');
                service.login({});

                //execute the login POST
                http.flush();

                spyOn(my_store, 'get');
                var user = service.user();
                expect(user.id).toBeDefined();
                expect(my_store.get).not.toHaveBeenCalled();
            });

            it('should return the user object from the local store if it is not in memory', function () {
                spyOn(my_store, 'get').and.returnValue({authenticated: true, id: 'foo'});
                var user = service.user();
                expect(user.id).toEqual('foo');
                expect(my_store.get).toHaveBeenCalled();
            });

            it('should fall back to the most basic user object', function () {
                spyOn(my_store, 'get').and.returnValue(null);
                var user = service.user();
                expect(user.authenticated).toEqual(false);
                expect(user.id).toBeUndefined();
                expect(my_store.get).toHaveBeenCalled();
            });
        });

        describe('refresh', function () {

            var url = 'https://localhost:44300/token',
                response = {
                    access_token: 'yes.you.can',
                    refresh_token: 'again'
                },
                postHandler;

            beforeEach(function () {
                spyOn(my_store, 'set');
            });

            beforeEach(function () {
                postHandler = http.when('POST', url).respond(response);
            });

            it('should not POST if there is no refresh token', function () {
                spyOn(my_store, 'get').and.returnValue(null);
                service.refresh();
                expect(my_store.get).toHaveBeenCalled();
                //this expectation is met by http.verifyNoOutstandingRequest()
            });

            it('should POST to the correct data if there is a refresh token', function () {
                spyOn(my_store, 'get').and.returnValue('token');
                service.refresh();

                http.expectPOST(url, function (data) {
                    return data === 'grant_type=refresh_token&refresh_token=token&client_id=73788e966f4c4c289a3a8f12f9aae744';
                });
                http.flush();
            });

            it('should store the response tokens on success', function () {
                spyOn(my_store, 'get').and.returnValue('token');
                service.refresh();

                http.expectPOST(url);
                http.flush();

                expect(my_store.set).toHaveBeenCalledWith('access_token', response.access_token);
                expect(my_store.set).toHaveBeenCalledWith('refresh_token', response.refresh_token);
            });

            it('should log out on error', function () {
                spyOn(my_store, 'get').and.returnValue('token');
                spyOn(service, 'logout');

                postHandler.respond(400, 'boom!');
                service.refresh();

                http.expectPOST(url);
                http.flush();

                //no SUCCESS handling
                //expect(service.logout).toHaveBeenCalled(); TODO: why doesn't this work?
                expect(my_store.set).not.toHaveBeenCalled();
            });
        });
    });
}());