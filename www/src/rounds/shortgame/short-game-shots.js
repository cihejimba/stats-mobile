(function (st) {

    var shortgame = function (hole, api) {
        if (api) {
            this.key = api.key;
            this.hole = api.holeNumber;
            this.initialPuttLength = api.initialLengthNumber;
            this.puttMadeLength = api.finalLengthNumber;
            this.putts = api.puttsCount;
            this.upAndDown = api.upAndDownFlag;
            this.sandSave = api.sandSaveFlag;
            this.holeOut = api.holeOutFlag;
        } else {
            this.key = undefined;
            this.hole = hole;
            this.initialPuttLength = undefined;
            this.puttMadeLength = undefined;
            this.putts = undefined;
            this.upAndDown = undefined;
            this.sandSave = undefined;
            this.holeOut = undefined;
        }
    },
    toApi = function (parentKey) {
        return {
            key: this.key,
            roundKey: parentKey,
            holeNumber: this.hole,
            initialLengthNumber: this.initialPuttLength,
            finalLengthNumber: this.puttMadeLength,
            puttsCount: this.putts,
            upAndDownFlag: this.upAndDown,
            sandSaveFlag: this.sandSave,
            holeOutFlag: this.holeOut
        };
    };

    shortgame.prototype = {
        constructor: shortgame,
        toApi: toApi
    };

    st.ShortGame = shortgame;

}(statracker));