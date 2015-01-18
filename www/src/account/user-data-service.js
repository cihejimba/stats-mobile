statracker.factory('userDataService', [
    '$http',
    '$q',
    'apiUrl',
    function ($http, $q, apiUrl) {

        var clubs = [], courses = [], availableClubs = [];

        var loadUserData = function () {
            var p1 = $q.defer(),
                p2 = $q.defer();

            if (clubs && clubs.length > 0) {
                p1.resolve(clubs);
            } else {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    }
                    p1.resolve(clubs);
                });
            }

            if (courses && courses.length > 0) {
                p2.resolve(courses);
            } else {
                $http.get(apiUrl + '/api/users/courses').then(function (response) {
                    if (response.data) {
                        courses = response.data;
                    }
                    p2.resolve(courses);
                });
            }

            return $q.all([p1.promise,p2.promise]).then(function (results) {
                return {
                    clubs: results[0],
                    courses: results[1]
                };
            });
        };

        var addCourse = function (description) {
            var deferred = $q.defer(),
                existing = courses && courses.find(function (c) {
                    return c.courseDescription.toLowerCase() === description.toLowerCase();
                });
            if (existing) {
                deferred.resolve(undefined);
            } else {
                $http.post(apiUrl + '/api/users/courses', { courseDescription: description }).then(function (response) {
                    courses.push(response.data);
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var addClub = function (club) {
            var deferred = $q.defer();
            $http.post(apiUrl + '/api/users/clubs', club).then(function (response) {
                club.key = response.data.key;
                clubs.push(club);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var addClubs = function (newClubs) {
            var deferred = $q.defer();
            $http.put(apiUrl + '/api/users/clubs', newClubs).then(function () {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                        deferred.resolve(clubs);
                    }
                });
            });
            return deferred.promise;
        };

        var updateClub = function (club) {
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.put(apiUrl + '/api/users/clubs/' + club.key, club).then(function (response) {
                club.key = response.data.key;
                clubs[index] = club;
            });
        };

        var removeClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.delete(apiUrl + '/api/users/clubs/' + club.key).then(function () {
                clubs.splice(index, 1);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var getDefaultClubs = function () {
            var deferred = $q.defer();

            if (availableClubs && availableClubs.length > 0) {
                deferred.resolve(availableClubs);
            } else {
                $http.get(apiUrl + '/api/clubs').then(function (response) {
                    if (response.data) {
                        availableClubs = response.data.map(function (club) {
                            var approachFlag = true,
                                teeballFlag = false;
                            if (club.clubName === 'Driver' || club.clubName.endsWith('Wood')) {
                                approachFlag = false;
                                teeballFlag = true;
                            } else if (club.clubName === 'Putter') {
                                approachFlag = false;
                            }
                            return {
                                key: club.key,
                                name: club.clubName,
                                sortOrder: club.key,
                                approachFlag: approachFlag,
                                teeballFlag: teeballFlag
                            };
                        });
                    }
                    deferred.resolve(availableClubs);
                });
            }
            return deferred.promise;
        };

        return {
            get clubs() { return clubs; },
            get courses() { return courses; },
            getDefaultClubs: getDefaultClubs,
            loadUserData: loadUserData,
            addCourse: addCourse,
            addClub: addClub,
            addClubs: addClubs,
            updateClub: updateClub,
            removeClub: removeClub
        };
    }
]);