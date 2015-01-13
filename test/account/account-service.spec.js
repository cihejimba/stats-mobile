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
                decodeToken: function () {}
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

            it('should pass the correct data to POST', function () {

                service.login(credentials);

                http.expectPOST(url, function (data) {
                   return data === 'grant_type=password&username=user@test.com&password=foo&client_id=73788e966f4c4c289a3a8f12f9aae744';
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
    });
}());