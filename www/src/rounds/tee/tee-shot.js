(function (st) {

    var shot = function (hole, apiShot) {
        if (apiShot) {
            this.key = apiShot.key;
            this.hole = apiShot.holeNumber;
            this.clubKey = apiShot.clubKey;
            this.distance = apiShot.distanceNumber;
            this.result = apiShot.resultId;
            this.coordinates = {
                x: apiShot.resultX,
                y: apiShot.resultY
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
    toApi = function (parentKey) {
        return {
            key: this.key,
            roundKey: parentKey,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultX: this.coordinates ? this.coordinates.x : undefined,
            resultY: this.coordinates ? this.coordinates.y : undefined
        };
    };

    shot.prototype = {
        constructor: shot,
        toApi: toApi
    };

    st.TeeShot = shot;

}(statracker));