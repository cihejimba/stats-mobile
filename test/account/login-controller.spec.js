(function () {
    'use strict';

    describe('login-controller', function () {

        var my_service, my_state, ctrl;

        beforeEach(module('statracker'));

        beforeEach(function () {
            my_service = {
                login: function () {}
            };
            my_state = {
                go: function () {}
            };
        });

        beforeEach(function () {
            inject(function ($controller) {
                ctrl = $controller('LoginController', {$state: my_state, accountService: my_service});
            });
        });

        describe('setup', function () {

            it('should have a credentials object', function () {
                expect(ctrl.credentials).not.toBeUndefined();
            });
        });

        describe('canLogin', function () {

            it('should return false if the email is missing', function () {
                ctrl.credentials.password = 'password';
                var result = ctrl.canLogin();
                expect(result).toEqual(false);
            });

            it('should return false if the email is empty', function () {
                ctrl.credentials.email = '';
                ctrl.credentials.password = 'password';
                var result = ctrl.canLogin();
                expect(result).toEqual(false);
            });

            it('should return false if the password is missing', function () {
                ctrl.credentials.email = 'foo@bar.com';
                var result = ctrl.canLogin();
                expect(result).toEqual(false);
            });

            it('should return false if the password is empty', function () {
                ctrl.credentials.email = 'foo@bar.com';
                ctrl.credentials.password = '';
                var result = ctrl.canLogin();
                expect(result).toEqual(false);
            });

            it('should return true if the email and password have been entered', function () {
                ctrl.credentials.email = 'foo@bar.com';
                ctrl.credentials.password = 'password';
                var result = ctrl.canLogin();
                expect(result).toEqual(true);
            });
        });

        describe('doLogin', function () {

            var q, scope;

            beforeEach(function () {
                inject(function ($q, $rootScope) {
                    q = $q;
                    scope = $rootScope;
                });
            });

            it('should navigate to tab.rounds if the credentials are valid', function () {
                spyOn(my_state, 'go');
                spyOn(my_service, 'login').and.returnValue(q.when({}));
                ctrl.credentials.email = 'foo@bar.com';
                ctrl.credentials.password = 'password';

                ctrl.doLogin();
                scope.$digest(); //resolve the fake promise

                expect(my_service.login).toHaveBeenCalledWith(ctrl.credentials);
                expect(my_state.go).toHaveBeenCalledWith('tab.rounds');
            });

            it('should set the error flag and description if the credentials are invalid', function () {
                var deferred = q.defer();
                deferred.reject({error_description: 'boom!'});

                spyOn(my_service, 'login').and.returnValue(deferred.promise);

                ctrl.doLogin();
                scope.$digest(); //resolve the fake promise

                expect(ctrl.credentials.hasError).toEqual(true);
                expect(ctrl.credentials.error).toEqual('boom!');
            });

            it('should set the error flag and description if the authorization server is unreachable', function () {
                var deferred = q.defer();
                deferred.reject(null);

                spyOn(my_service, 'login').and.returnValue(deferred.promise);

                ctrl.doLogin();
                scope.$digest(); //resolve the fake promise

                expect(ctrl.credentials.hasError).toEqual(true);
                expect(ctrl.credentials.error).toEqual('Cannot reach the StaTracker authorization server');
            });
        });
    });
}());