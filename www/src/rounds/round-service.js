statracker.factory('roundService', [
    '$http',
    '$q',
    'localStore',
    'apiUrl',
    function ($http, $q, localStore, apiUrl) {

        var currentRound;

        var getCurrentRound = function () {
            if (currentRound) {
                return currentRound;
            }
            currentRound = localStore.get('round');
            return currentRound;
        };

        var loadRound = function (key) {
            var deferred = $q.defer(),
                round = getCurrentRound();

            if (round && round.key === key) {
                deferred.resolve(round);
            } else {
                $http.get(apiUrl + '/api/rounds/' + key).then(function (response) {
                    currentRound = new statracker.Round(null, null, null, response.data);
                    localStore.set('round', currentRound);
                    deferred.resolve(currentRound);
                });
            }
            return deferred.promise;
        };

        var getRounds = function () {
            return $http.get(apiUrl + '/api/rounds');
        };

        var createRound = function (course, datePlayed, holes) {
            currentRound = new statracker.Round(course, datePlayed, holes);
            localStore.set('round', currentRound);
            return currentRound;
        };

        var updateRound = function (round, doSynch) {
            var deferred = $q.defer();
            currentRound = round;
            if (doSynch) {
                var postRound = currentRound.toApi();
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + '/api/rounds/' + currentRound.key, postRound).then(function () {
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + '/api/rounds', postRound).then(function (response) {
                        currentRound.key = response.data.key; //TODO: import the response?
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                }
            } else {
                localStore.set('round', currentRound);
                deferred.resolve(currentRound);
            }
            return deferred.promise;
        };

        var completeRound = function (round) {
            updateRound(round);
            localStore.remove('round');
        };

        var deleteRound = function (key) {
            $http.delete(apiUrl + '/api/rounds/' + key).then(function () {
                if (currentRound && currentRound.key === key) {
                    currentRound = undefined;
                    localStore.remove('round');
                }
            });
        };

        return {
            loadRound: loadRound,
            getAll: getRounds,
            getCurrentRound: getCurrentRound,
            setCurrentHole: function (hole) {
                localStore.set('hole', hole);
            },
            getCurrentHole: function () {
                var hole = localStore.get('hole');
                return (!hole ? 1 : hole);
            },
            create: createRound,
            update: updateRound,
            complete: completeRound,
            delete: deleteRound
        };
    }
]);
