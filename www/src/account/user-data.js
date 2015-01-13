statracker.factory('userData', [
    '$http',
    '$q',
    'apiUrl',
    function ($http, $q, apiUrl) {

        var clubs, courses;

        var loadUserData = function () {
            var p1 = $q.defer(),
                p2 = $q.defer();

            if (clubs) {
                p1.resolve(clubs);
            } else {
                $http.get(apiUrl + '/api/users/clubs').then(function (response) {
                    clubs = response.data;
                    p1.resolve(clubs);
                });
            }

            if (courses) {
                p2.resolve(courses);
            } else {
                $http.get(apiUrl + '/api/users/courses').then(function (response) {
                    courses = response.data;
                    p2.resolve(courses);
                });
            }

            return $q.all([p1,p2]);
        };

        return {
            get clubs() { return clubs; },
            get courses() { return courses; },
            loadUserData: loadUserData
        };
    }
]);