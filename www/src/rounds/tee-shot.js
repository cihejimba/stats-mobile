(function (st) {

    var importShot, exportShot, shot;

    importShot = function (s) {
        this.key = s.key;
        this.hole = s.holeNumber;
        this.clubKey = s.clubKey;
        this.distance = s.distanceNumber;
        this.result = s.resultId;
        this.coordinates = {
            x: s.resultXNumber,
            y: s.resultYNumber
        };
    };

    exportShot = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            clubKey: this.clubKey,
            distanceNumber: this.distance,
            resultId: this.result,
            resultXNumber: this.coordinates.x,
            resultYNumber: this.coordinates.y
        };
    };

    shot = function (hole) {
        this.key = undefined;
        this.hole = hole;
        this.clubKey = undefined;
        this.distance = undefined;
        this.result = undefined;
        this.coordinates = undefined;
    };

    shot.prototype = {
        constructor: shot,
        importShot: importShot,
        exportShot: exportShot
    };

    st.TeeShot = shot;

}(statracker));