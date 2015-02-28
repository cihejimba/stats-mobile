(function (st) {

    var importRound, exportRound, round, fairwayStats, calculateStats,
        puttingStats, approachStats, upAndDownStats, sandSaveStats;

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
        self.totalFairways = r.totalFairwaysNumber;
        self.isTournament = r.tournamentFlag;
        self.isComplete = r.completedFlag;
        self.notes = r.notesText;

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
            this.totalFairways = (holes === 18) ? 14 : 7;
            this.notes = undefined;
            this.isTournament = false;
            this.isComplete = false;

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
            totalFairwaysNumber: this.totalFairways,
            notesText: this.notes,
            tournamentFlag: this.isTournament,
            completedFlag: this.isComplete,
            teeShots: [],
            approachShots: [],
            shortGameShots: []
        };
        var i;
        for (i = 0; i < this.holes; i++) {
            outbound.teeShots.push(this.teeShots[i].toApi(this.key));
            outbound.approachShots.push(this.approachShots[i].toApi(this.key));
            outbound.shortGameShots.push(this.shortGameShots[i].toApi(this.key));
        }
        return outbound;
    };

    fairwayStats = function (self) {
        var shots = 0, distance = 0, fairways = 0;
        self.teeShots.forEach(function (shot) {
            if (shot.distance) {
                distance += shot.distance;
                shots += 1;
                if (shot.result % 10 === 0) {
                    fairways += 1;
                }
            }
        });
        if (shots === 0) return 0;
        return {
            averageDistance: distance / shots,
            fairwaysHit: fairways
        };
    };

    approachStats = function (self) {
        var shots = 0,
            yardage = 0,
            distance = 0,
            greens = 0;
        self.approachShots.forEach(function (shot) {
            if (shot.yardage) {
                yardage += shot.yardage;
                shots += 1;
                if (shot.result <= 24) {
                    greens += 1;
                }
            }
        });
        self.shortGameShots.forEach(function (hole) {
            if (hole.initialPuttLength && !hole.sandSave && !hole.upAndDown) {
                distance += hole.initialPuttLength;
            }
        });
        return {
            averageYardage: (shots === 0) ? 0 : yardage / shots,
            averageLeave: (shots === 0) ? 0 : distance / greens,
            greensHit: greens
        };
    };

    puttingStats = function (self) {
        var putts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.putts) {
                putts += hole.putts;
            }
            if (hole.puttMadeLength) {
                distance += hole.puttMadeLength;
            }
        });
        return {
            putts: putts,
            madePutts: distance
        };
    };

    upAndDownStats = function (self) {
        var conversions = 0,
            attempts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.upAndDown !== null) {
                attempts += 1;
                conversions += (hole.upAndDown) ? 1 : 0;
                if (hole.initialPuttLength) distance += hole.initialPuttLength;
            }
        });
        return {
            attempts: attempts,
            conversions: conversions,
            percentage: (attempts === 0) ? 0 : 100 * conversions / attempts,
            averageLeave: (attempts === 0) ? 0 : distance / attempts
        };
    };

    sandSaveStats = function (self) {
        var conversions = 0,
            attempts = 0,
            distance = 0;
        self.shortGameShots.forEach(function (hole) {
            if (hole.sandSave !== null) {
                attempts += 1;
                conversions += (hole.sandSave) ? 1 : 0;
                if (hole.initialPuttLength) distance += hole.initialPuttLength;
            }
        });
        return {
            attempts: attempts,
            conversions: conversions,
            percentage: (attempts === 0) ? 0 : 100 * conversions / attempts,
            averageLeave: (attempts === 0) ? 0 : distance / attempts
        };
    };

    calculateStats = function () {
        var dd = fairwayStats(this),
            app = approachStats(this),
            p = puttingStats(this),
            uad = upAndDownStats(this),
            ss = sandSaveStats(this);
        return {
            driving: dd,
            approachShots: app,
            putting: p,
            upAndDowns: uad,
            sandSaves: ss
        };
    };

    round.prototype = {
        constructor: round,
        toApi: exportRound,
        calculateStats: calculateStats
    };

    st.Round = round;

}(statracker));