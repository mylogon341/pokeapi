"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveInfo = void 0;
class MoveInfo {
    constructor(data) {
        this.name = data.name.removeDashes().capitaliseEachWord();
        this.type = data.type.name.removeDashes().capitaliseEachWord();
    }
}
exports.MoveInfo = MoveInfo;
//# sourceMappingURL=moveInfo.js.map