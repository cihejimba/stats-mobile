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

        var getRound = function (key) {
            var deferred = $q.defer();
            $http.get(apiUrl + '/api/rounds/' + key).then(function (response) {
                currentRound = statracker.Round.import(response.data);
                localStore.set('round', currentRound);
                deferred.resolve(currentRound);
            });
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
                var updated = statracker.Round.export(round);
                if (currentRound.key && currentRound.key > 0) {
                    $http.put(apiUrl + '/api/rounds/' + currentRound.key, updated).then(function () {
                        localStore.set('round', currentRound);
                        deferred.resolve(currentRound);
                    });
                } else {
                    $http.post(apiUrl + '/api/rounds', updated).then(function (response) {
                        currentRound.key = response.data.id;
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
            getCurrent: getCurrentRound,
            getOne: getRound,
            getAll: getRounds,
            create: createRound,
            update: updateRound,
            complete: completeRound,
            delete: deleteRound
        };
    }
]);
