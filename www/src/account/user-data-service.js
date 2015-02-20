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
                $http.get(apiUrl + 'users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    }
                    p1.resolve(clubs);
                });
            }

            if (courses && courses.length > 0) {
                p2.resolve(courses);
            } else {
                $http.get(apiUrl + 'users/courses').then(function (response) {
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

        var addCourse = function (course) {
            var deferred = $q.defer(),
                description = course.description + '(' + course.tees + ')',
                existing = courses && courses.find(function (c) {
                        return c.description.toLowerCase() === description.toLowerCase();
                });
            if (existing) {
                deferred.resolve(existing);
            } else {
                var postCourse = {
                    key: 0,
                    courseDescription: course.description,
                    teesName: course.tees,
                    holesNumber: course.holes,
                    parNumber: course.par
                };
                $http.post(apiUrl + 'users/courses', postCourse).then(function (response) {
                    courses.push({
                        key: response.data.key,
                        description: response.data.courseDescription + ' (' + response.data.teesName + ')',
                        holes: response.data.holesNumber
                    });
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var createCourse = function (course) {
            var deferred = $q.defer(),
                description = course.courseDescription + '(' + course.teesName + ')',
                existing = courses && courses.find(function (c) {
                        return c.description.toLowerCase() === description.toLowerCase();
                    });
            if (existing) {
                deferred.reject('A course named ' + description + ' already exists');
            } else {
                $http.post(apiUrl + 'users/courses', course).then(function (response) {
                    courses.push({
                        key: response.data.key,
                        description: response.data.courseDescription + ' (' + response.data.teesName + ')',
                        holes: response.data.holesNumber
                    });
                    deferred.resolve(response.data);
                });
            }
            return deferred.promise;
        };

        var updateCourse = function (course) {
            return $http.put(apiUrl + 'users/courses/' + course.key, course);
        };

        var deleteCourse = function (course) {
            var deferred = $q.defer(),
                idx = courses.findIndex(function (c) {
                    return c.key === course.key;
                });
            $http.delete(apiUrl + 'users/courses/' + course.key).then(function () {
                courses.splice(idx, 1);
                deferred.resolve(courses);
            });
            return deferred.promise;
        };

        var getCourse = function (key) {
            return $http.get(apiUrl + 'users/courses/' + key);
        };

        var getClub = function (key) {
            return $http.get(apiUrl + 'users/clubs/' + key);
        };

        var addClub = function (club) {
            var deferred = $q.defer();
            $http.post(apiUrl + 'users/clubs', club).then(function (response) {
                clubs.push(response.data);
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var addClubs = function (newClubs) {
            var deferred = $q.defer();
            $http.put(apiUrl + 'users/clubs', newClubs).then(function () {
                $http.get(apiUrl + 'users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                        deferred.resolve(clubs);
                    }
                });
            });
            return deferred.promise;
        };

        var updateClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            clubs[index] = club;
            $http.put(apiUrl + 'users/clubs/' + club.key, club).then(function () {
                deferred.resolve(clubs);
            });
            return deferred.promise;
        };

        var removeClub = function (club) {
            var deferred = $q.defer();
            var index = clubs.findIndex(function (c) { return c.key === club.key; });
            $http.delete(apiUrl + 'users/clubs/' + club.key).then(function () {
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
                $http.get(apiUrl + 'clubs').then(function (response) {
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
            getCourse: getCourse,
            createCourse: createCourse,
            updateCourse: updateCourse,
            deleteCourse: deleteCourse,
            getClub: getClub,
            addClub: addClub,
            addClubs: addClubs,
            updateClub: updateClub,
            removeClub: removeClub
        };
    }
]);