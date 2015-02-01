(function (st) {

    var importRound, exportRound, round;

    importRound = function (self, r) {
        var hole;

        self.key = r.key;
        self.datePlayed = r.roundDate;
        self.courseKey = r.courseKey;
        self.courseDescription = r.course.courseDescription;
        self.holes = r.holesCount;
        self.score = r.scoreNumber;
        self.greens = r.greensNumber;
        self.fairways = r.fairwaysNumber;
        self.penalties = r.penaltiesNumber;

        self.teeShots = [];
        self.approachShots = [];
        self.shortGameShots = [];

        for (hole = 0; hole < r.holesCount; hole++) {
            self.teeShots.push(new st.TeeShot(hole+1, r.teeShots[hole]));
            self.approachShots.push(new st.ApproachShot(hole+1, r.approachShots[hole]));
            self.shortGameShots.push(new st.ShortGame(hole+1, r.shortGameShots[hole]));
        }
    };

    round = function (course, datePlayed, holes, api) {
        var hole;

        if (api) {
            importRound(this, api);
        } else {
            this.key = undefined;
            this.courseKey = course.key;
            this.courseDescription = course.courseDescription;
            this.datePlayed = datePlayed;
            this.holes = holes;
            this.score = undefined;
            this.greens = undefined;
            this.fairways = undefined;
            this.penalties = undefined; //TODO: change to total fairways

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