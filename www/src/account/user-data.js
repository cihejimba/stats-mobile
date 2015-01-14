statracker.factory('userData', [
    '$http',
    '$q',
    'apiUrl',
    function ($http, $q, apiUrl) {

        var clubs = [], courses = [];

        var loadUserData = function () {
            var p1 = $q.defer(),
                p2 = $q.defer();

            if (clubs && clubs.length > 0) {
                p1.resolve(clubs);
            } else {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    if (response.data) {
                        clubs = response.data;
                    } //TODO: else load default clubs for new user
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

            return $q.all([p1,p2]);
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

        return {
            get clubs() { return clubs; },
            get courses() { return courses; },
            loadUserData: loadUserData,
            addCourse: addCourse
        };
    }
]);