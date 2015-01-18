(function (st) {

    var importRound, exportRound, round;

    importRound = function (r) {
        var hole;

        this.key = r.key;
        this.datePlayed = r.roundDate;
        this.courseKey = r.courseKey;
        this.holes = r.holesCount;
        this.score = r.scoreNumber;
        this.greens = r.greensNumber;
        this.fairways = r.fairwaysNumber;
        this.penalties = r.penaltiesNumber;
        this.sandSaveAttempts = r.sandSaveAttemptsNumber;
        this.sandSaveConversions = r.sandSaveConvertedNumber;
        this.upAndDownAttempts = r.upAndDownAttemptsNumber;
        this.upAndDownConversions = r.upAndDownConvertedNumber;

        this.teeShots = [];
        this.approachShots = [];
        this.shortGameShots = [];

        for (hole = 0; hole < r.holesCount; hole++) {
            this.teeShots.push(new st.TeeShot(hole+1, r.teeShots[hole]));
            this.approachShots.push(new st.ApproachShot(hole+1, r.approachShots[hole]));
            this.shortGameShots.push(new st.ShortGame(hole+1, r.shortGameShots[hole]));
        }
    };

    round = function (course, datePlayed, holes, api) {
        var hole;

        if (api) {
            importRound(api);
        } else {
            this.key = undefined;
            this.courseKey = course.key;
            this.courseName = course.description;
            this.datePlayed = datePlayed;
            this.holes = holes;
            this.score = undefined;
            this.greens = undefined;
            this.fairways = undefined;
            this.penalties = undefined;
            this.sandSaveAttempts = undefined;
            this.sandSaveConversions = undefined;
            this.upAndDownAttempts = undefined;
            this.upAndDownConversions = undefined;

            this.teeShots = [];
            this.approachShots = [];
            this.shortGameShots = [];

            for (hole = 1; hole <= holes; hole++) {
                this.teeShots.push(new st.TeeShot(hole));
                this.approachShots.push(new st.ApproachShot(hole));
                this.shortGameShots.push(new st.ShortGame(hole));
            }
        }
    };

    exportRound = function () {
        var outbound = {
            key: this.key,
            roundDate: this.datePlayed,
            courseKey: this.courseKey,
            holesCount: this.holes,
            scoreNumber: this.score,
            greensNumber: this.greens,
            fairwaysNumber: this.fairways,
            penaltiesNumber: this.penalties,
            sandSaveAttemptsNumber: this.sandSaveAttempts,
            sandSaveConvertedNumber: this.sandSaveConversions,
            upAndDownAttemptsNumber: this.upAndDownAttempts,
            upAndDownConvertedNumber: this.upAndDownConversions,
            teeShots: [],
            approachShots: [],
            shortGameShots: []
        };
        var i;
        for (i = 0; i < this.holes; i++) {
            outbound.teeShots.push(this.teeShots[i].toApi());
            outbound.approachShots.push(this.approachShots[i].toApi());
            outbound.shortGameShots.push(this.shortGameShots[i].toApi());
        }
        return outbound;
    };

    round.prototype = {
        constructor: round,
        toApi: exportRound
    };

    st.Round = round;

}(statracker));