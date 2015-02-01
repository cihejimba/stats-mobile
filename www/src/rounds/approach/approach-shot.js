(function (st) {

    var results = [
        'On the green, inside 3 feet',
        'On the green, inside 12 feet, short',
        'On the green, inside 12 feet, short right',
        'On the green, inside 12 feet, right',
        'On the green, inside 12 feet, long right',
        'On the green, inside 12 feet, long',
        'On the green, inside 12 feet, long left',
        'On the green, inside 12 feet, left',
        'On the green, inside 12 feet, short left',
        'On the green, inside 30 feet, short',
        'On the green, inside 30 feet, short right',
        'On the green, inside 30 feet, right',
        'On the green, inside 30 feet, long right',
        'On the green, inside 30 feet, long',
        'On the green, inside 30 feet, long left',
        'On the green, inside 30 feet, left',
        'On the green, inside 30 feet, short left',
        'On the green, outside 30 feet, short',
        'On the green, outside 30 feet, short right',
        'On the green, outside 30 feet, right',
        'On the green, outside 30 feet, long right',
        'On the green, outside 30 feet, long',
        'On the green, outside 30 feet, long left',
        'On the green, outside 30 feet, left',
        'On the green, outside 30 feet, short left',
        'Missed green (less than 6 feet), short',
        'Missed green (less than 6 feet), short right',
        'Missed green (less than 6 feet), right',
        'Missed green (less than 6 feet), long right',
        'Missed green (less than 6 feet), long',
        'Missed green (less than 6 feet), long left',
        'Missed green (less than 6 feet), left',
        'Missed green (less than 6 feet), short left',
        'Missed green, short',
        'Missed green, short right',
        'Missed green, right',
        'Missed green, long right',
        'Missed green, long',
        'Missed green, long left',
        'Missed green, left',
        'Missed green, short left'];

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.yardage = apiShot.yardageNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultXNumber,
                y: apiShot.resultYNumber
            };
        } else {
            this.key = undefined;
            this.hole = hole;
            this.clubKey = undefined;
            this.yardage = undefined;
            this.result = undefined;
            this.coordinates = undefined;
        }
    },
    toApi = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            yardageNumber: this.yardage,
            resultId: this.result,
            resultXNumber: this.coordinates ? this.coordinates.x : undefined,
            resultYNumber: this.coordinates ? this.coordinates.y : undefined
        };
    },
    resultText = function () {
        return results[this.result];
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi,
        getResultText: resultText
    };

    st.ApproachShot = shot;

}(statracker));