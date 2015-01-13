(function (st) {

    var importShots, exportShots, shortgame;

    importShots = function (s) {
        this.key = s.key;
        this.hole = s.holeNumber;
        this.initialPuttLength = s.initialLengthNumber;
        this.puttMadeLength = s.finalLengthNumber;
        this.putts = s.puttsCount;
        this.upAndDown = s.upAndDownFlag;
        this.sandSave = s.sandSaveFlag;
        this.holeOut = s.holeOutFlag;
    };

    exportShots = function () {
        return {
            key: this.key,
            holeNumber: this.hole,
            initialLengthNumber: this.initialPuttLength,
            finalLengthNumber: this.puttMadeLength,
            puttsCount: this.putts,
            upAndDownFlag: this.upAndDown,
            sandSaveFlag: this.sandSave,
            holeOutFlag: this.holeOut
        };
    };

    shortgame = function (hole) {
        this.key = undefined;
        this.hole = hole;
        this.initialPuttLength = undefined;
        this.puttMadeLength = undefined;
        this.putts = undefined;
        this.upAndDown = undefined;
        this.sandSave = undefined;
        this.holeOut = undefined;
    };

    shortgame.prototype = {
        constructor: shortgame,
        importShots: importShots,
        exportShots: exportShots
    };

    st.ShortGame = shortgame;

}(statracker));