"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
class GameVar {
    constructor(data) {
        this.version_name = data["version_group"].name;
        this.level_learned_at = Number(data["level_learned_at"]);
        this.learned_via = data["move_learn_method"].name;
    }
}
class Move {
    constructor(data) {
        this.name = data.move.name;
        const groupDetails = data["version_group_details"];
        this.game_variants = groupDetails.map(g => new GameVar(g));
    }
}
exports.Move = Move;
//# sourceMappingURL=moves.js.map