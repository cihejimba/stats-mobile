(function (st) {

    var results = [
        'Fairway, less than 200 yards',
        'Miss left (first cut up to 2 paces), less than 200 yards',
        'Miss right (first cut up to 2 paces), less than 200 yards',
        'Big miss left, less than 200 yards',
        'Big miss right, less than 200 yards',
        'Out of play (hazard or OB) left, less than 200 yards',
        'Out of play (hazard or OB) right, less than 200 yards',
        'Fairway, 200 - 225 yards',
        'Miss left (first cut up to 2 paces), 200 - 225 yards',
        'Miss right (first cut up to 2 paces), 200 - 225 yards',
        'Big miss left, 200 - 225 yards',
        'Big miss right, 200 - 225 yards',
        'Out of play (hazard or OB) left, 200 - 225 yards',
        'Out of play (hazard or OB) right, 200 - 225 yards',
        'Fairway, 225 - 250 yards',
        'Miss left (first cut up to 2 paces), 225 - 250 yards',
        'Miss right (first cut up to 2 paces), 225 - 250 yards',
        'Big miss left, 225 - 250 yards',
        'Big miss right, 225 - 250 yards',
        'Out of play (hazard or OB) left, 225 - 250 yards',
        'Out of play (hazard or OB) right, 225 - 250 yards',
        'Fairway, 250 - 275 yards',
        'Miss left (first cut up to 2 paces), 250 - 275 yards',
        'Miss right (first cut up to 2 paces), 250 - 275 yards',
        'Big miss left, 250 - 275 yards',
        'Big miss right, 250 - 275 yards',
        'Out of play (hazard or OB) left, 250 - 275 yards',
        'Out of play (hazard or OB) right, 250 - 275 yards',
        'Fairway, 275 - 300 yards',
        'Miss left (first cut up to 2 paces), 275 - 300 yards',
        'Miss right (first cut up to 2 paces), 275 - 300 yards',
        'Big miss left, 275 - 300 yards',
        'Big miss right, 275 - 300 yards',
        'Out of play (hazard or OB) left, 275 - 300 yards',
        'Out of play (hazard or OB) right, 275 - 300 yards',
        'Fairway, over 300 yards',
        'Miss left (first cut up to 2 paces), over 300 yards',
        'Miss right (first cut up to 2 paces), over 300 yards',
        'Big miss left, over 300 yards',
        'Big miss left, over 300 yards',
        'Out of play (hazard or OB) left, over 300 yards',
        'Out of play (hazard or OB) right, over 300 yards'
    ];

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.distance = apiShot.distanceNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultXNumber,
                y: apiShot.resultYNumber
            };
        } else {
            this.key = undefined;
            this.hole = hole;
            this.clubKey = undefined;
            this.distance = undefined;
            this.result = undefined;
            this.coordinates = undefined;
        }
    },
    toApi = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultXNumber: this.coordinates ? this.coordinates.x : undefined,
            resultYNumber: this.coordinates ? this.coordinates.y : undefined
        };
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi,
        getResultText: function () {
            return results[this.result];
        }
    };

    st.TeeShot = shot;

}(statracker));