(function () {
    'use strict';

    describe('club-detail-controller', function () {

        var my_user_data_service, my_state, my_scope,
            ctrl,
            clubs = [{key: 1, name: 'niblick'}, {key: 2, name: 'mashie'}];

        beforeEach(module('statracker'));

        beforeEach(inject(function ($q) {
            var deferred = $q.defer();
            deferred.resolve(clubs);

            my_user_data_service = {
                getDefaultClubs: function () {},
                addClub: function () {},
                updateClub: function () {}
            };
            my_state = {
                go: function () {}
            };

            spyOn(my_user_data_service, 'getDefaultClubs').and.returnValue(deferred.promise);
        }));

        beforeEach(function () {
            inject(function ($controller, $rootScope) {
                my_scope = $rootScope.$new();
                ctrl = $controller('ClubDetailController', {$state: my_state, $scope: my_scope, userDataService: my_user_data_service});
            });
        });

        describe('setup', function () {

            it('should populate the default clubs collection', inject(function ($rootScope) {

                $rootScope.$digest(); //resolve getDefaultClubs promise

                expect(my_user_data_service.getDefaultClubs).toHaveBeenCalled();
                expect(ctrl.clubs).toEqual(clubs);
            }));
        });

        describe('beforeEnter event handler', function () {

            it('should set the current user club to the object in the state params collection', inject(function ($rootScope) {
                var userClub = {
                    key: 1,
                    clubKey: 1
                };
                my_state.params = {
                    club: userClub
                };

                $rootScope.$broadcast('$ionicView.beforeEnter');
                $rootScope.$digest();

                expect(ctrl.userClub).toEqual(userClub);
            }));
        });

        describe('saveClub', function () {

            beforeEach(inject(function ($q) {
                ctrl.userClub = {
                    clubKey: 1,
                    approachFlag: true
                };
                spyOn(my_state, 'go');
                spyOn(my_user_data_service, 'addClub').and.returnValue($q.when({}));
                spyOn(my_user_data_service, 'updateClub').and.returnValue($q.when({}));
            }));

            beforeEach(function () {
                my_scope.$digest(); //promise that loads the default clubs collection
            });

            it('should add a new club if the user club key is undefined', function () {
                ctrl.saveClub();
                expect(my_user_data_service.addClub).toHaveBeenCalledWith(ctrl.userClub);
                my_scope.$digest();
                expect(my_state.go).toHaveBeenCalledWith('^.my-bag');
            });

            it('should update the club reference on the userClub object before calling the add function', function () {
                ctrl.saveClub();
                my_scope.$digest();
                expect(ctrl.userClub).toEqual({
                    clubKey: 1,
                    approachFlag: true,
                    key: 0,
                    club: {
                        key: 1,
                        clubName: 'niblick'
                    }
                });
            });

            it('should update an existing club if the user club key is present', function () {
                ctrl.userClub.key = 1;
                ctrl.saveClub();
                expect(my_user_data_service.updateClub).toHaveBeenCalledWith(ctrl.userClub);
                my_scope.$digest();
                expect(my_state.go).toHaveBeenCalledWith('^.my-bag');
            });
        });
    });
}());