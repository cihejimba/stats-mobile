(function (st) {

    var importRound, exportRound, round;

    importRound = function (r) {
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
        var i;
        for (i = 0; i < r.holesCount; i++) {
            this.teeShots.push(st.TeeShot.importShot(r.teeShots[i]));
            this.approachShots.push(st.ApproachShot.importShot(r.approachShots[i]));
            this.shortGameShots.push(st.ShortGame.importShots(r.shortGameShots[i]));
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
            outbound.teeShots.push(st.TeeShot.exportShot(this.teeShots[i]));
            outbound.approachShots.push(st.ApproachShot.exportShot(this.approachShots[i]));
            outbound.shortGameShots.push(st.ShortGame.exportShots(this.shortGameShots[i]));
        }
    };

    round = function (course, datePlayed, holes) {
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

        var hole;
        for (hole = 1; hole <= holes; hole++) {
            this.teeShots.push(new st.TeeShot(hole));
            this.approachShots.push(new st.ApproachShot(hole));
            this.shortGameShots.push(new st.ShortGame(hole));
        }
    };

    round.prototype = {
        constructor: round,
        import: importRound,
        export: exportRound
    };

    st.Round = round;

}(statracker));