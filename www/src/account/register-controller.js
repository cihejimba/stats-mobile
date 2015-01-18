statracker.controller('RegisterController', [
    '$state',
    'accountService',
    'userDataService',
    function ($state, accountService, userDataService) {

        var vm = this,
            defaultBag = [
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Driver' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 1 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '3 Wood' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 2 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '5 Wood' }, teeballFlag: true, approachFlag: false, sortOrderNumber: 3 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '4 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 4 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '5 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 5 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '6 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 6 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '7 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 7 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '8 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 8 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: '9 Iron' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 9 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Pitching Wedge' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 10 },
                { key: 0, clubKey: 0, club: { key: 0, clubName: 'Sand Wedge' }, teeballFlag: false, approachFlag: true, sortOrderNumber: 11 }
            ];

        userDataService.getDefaultClubs().then(function (clubs) {
            defaultBag.forEach(function (c, i) {
                var defaultClub = clubs.find(function (d) {
                    return c.club.clubName === d.name;
                });
                if (defaultClub) {
                    defaultBag[i].clubKey = defaultClub.key;
                    defaultBag[i].club.key = defaultClub.key;
                } else {
                    //TODO: this is a problem
                    console.log('what gives?');
                }
            });
            userDataService.addClubs(defaultBag).then(function (clubs) {
                this.clubs = clubs;
            });
        });

        vm.registration = {
            email: '',
            password: '',
            confirmPassword: '',
            hasError: false,
            error: ''
        };

        vm.doRegister = function () {
            vm.registration.hasError = false;
            vm.registration.error = '';
            if (vm.validate()) {
                accountService.register(vm.registration)
                    .success(function () {
                        accountService.login(vm.registration).then(function () {
                            userDataService.getDefaultClubs().then(function (clubs) {
                                defaultBag.forEach(function (c, i) {
                                    var defaultClub = clubs.find(function (d) {
                                        return c.club.clubName === d.name;
                                    });
                                    if (defaultClub) {
                                        defaultBag[i].clubKey = defaultClub.key;
                                        defaultBag[i].club.key = defaultClub.key;
                                    } else {
                                        //TODO: this is a problem
                                        console.log('what gives?');
                                    }
                                });
                                userDataService.addClubs(defaultBag).then(function () {
                                    //TODO: how to handle an error here?
                                    //at this point, our new user should have a default set of clubs to use
                                    $state.go('tab.rounds');
                                });
                            });
                        });
                    })
                    .error(function (error) {
                        vm.registration.hasError = true;
                        if (error.error_description) {
                            vm.registration.error = error.error_description;
                        } else if (error.modelState) {
                            vm.registration.error = error.modelState;
                        } else {
                            vm.registration.error = error;
                        }
                    });
            }
        };

        vm.validate = function () {
            if (vm.registration.email === '') {
                vm.registration.hasError = true;
                vm.registration.error = 'An email address is required';
                return false;
            }
            if (vm.registration.password === '') {
                vm.registration.hasError = true;
                vm.registration.error = 'A password is required';
                return false;
            }
            if (vm.registration.password !== vm.registration.confirmPassword) {
                vm.registration.hasError = true;
                vm.registration.error = 'The passwords do not match';
                return false;
            }
            return true;
        };
    }
]);
