statracker.factory('roundService', [
    '$http',
    '$q',
    'localStore',
    'apiUrl',
    'accountService',
    function ($http, $q, localStore, apiUrl, accountService) {

        var currentRound;

        var getCurrentRound = function () {
            var deferred = $q.defer();
            if (currentRound) {
                deferred.resolve(currentRound);
            } else {
                var id = localStore.get('roundId');
                if (id) {
                    return loadRound(id);
                } else {
                    deferred.reject();
                }
            }
            return deferred.promise;
        };

        var loadRound = function (key) {
            var deferred = $q.defer(),
            round; // = currentRound;

            if (round && round.key === key) {
                deferred.resolve(round);
            } else {
                $http.get(apiUrl + 'rounds/' + key).then(function (response) {
                    currentRound = new statracker.Round(null, null, null, response.data);
                    localStore.set('roundId', currentRound.key);
                    deferred.resolve(currentRound);
                });
            }
            return deferred.promise;
        };

        var getRounds = function (limit) {
            if (!limit) limit = 20;
            return $http.get(apiUrl + 'rounds?limit=' + limit);
        };

        var createRound = function (course, datePlayed, holes) {
            currentRound = new statracker.Round(course, datePlayed, holes);
            localStore.set('roundId', currentRound.key);
            return currentRound;
        };

        var updateRound = function (round, doSynch) {
            var deferred = $q.defer();
            currentRound = round;
            if (doSynch) {
                var postRound = currentRound.toApi();
                postRound.userId = accountService.user().id;
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + 'rounds/' + currentRound.key, postRound).then(function () {
                        localStore.set('roundId', currentRound.key);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + 'rounds', postRound).then(function (response) {
                        currentRound.key = response.data.key; //TODO: import the response?
                        localStore.set('roundId', currentRound.key);
                        deferred.resolve(currentRound);
                    });
                }
            } else {
                localStore.set('roundId', currentRound.key);
                deferred.resolve(currentRound);
            }
            return deferred.promise;
        };

        var completeRound = function (round) {
            return updateRound(round, true).then(function () {
                if (round.isComplete) {
                    localStore.remove('roundId');
                }
            });
        };

        var deleteRound = function (key) {
            return $http.delete(apiUrl + 'rounds/' + key).then(function () {
                if (currentRound && currentRound.key === key) {
                    currentRound = undefined;
                    localStore.remove('roundId');
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
