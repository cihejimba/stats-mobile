(function () {
    'use strict';

    describe('login-controller', function () {

        var q, my_service, my_state, ctrl;

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
    });
}());