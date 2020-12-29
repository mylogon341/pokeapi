"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
const Helpers_1 = require("../Helpers");
class GameVar {
    constructor(moveName, data) {
        this.version_name = Helpers_1.capitalizeFirstLetter(data["version_group"].name);
        this.version_url = data["version_group"].url;
        this.version_number = Helpers_1.versionNumberFromUrl(this.version_url);
        this.level_learned_at = Number(data["level_learned_at"]);
        this.learned_via = data["move_learn_method"].name;
        this.move_name = moveName;
    }
}
class Move {
    constructor(data) {
        this.name = Helpers_1.capitalizeFirstLetter(data.move.name);
        const groupDetails = data["version_group_details"];
        this.game_variants = groupDetails.map(g => new GameVar(this.name, g));
    }
}
exports.Move = Move;
//# sourceMappingURL=moves.js.map