"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = exports.BasicMove = void 0;
const common_1 = require("./common");
class GameVar {
    constructor(id, moveName, data) {
        this.id = id;
        this.version_name = data["version_group"]
            .name
            .removeDashes()
            .capitaliseEachWord();
        this.version_number = data["version_group"].url.versionNumberFromUrl();
        this.level_learned_at = Number(data["level_learned_at"]);
        this.learned_via = data["move_learn_method"].name;
        this.move_name = moveName.removeDashes().capitaliseFirstLetter();
    }
}
class BasicMove {
    constructor(data) {
        const id = data.move.url.versionNumberFromUrl();
        const name = data.move.name;
        const groupDetails = data["version_group_details"];
        this.game_variants = groupDetails.map(g => new GameVar(id, name, g));
    }
}
exports.BasicMove = BasicMove;
class Move {
    constructor(data) {
        this.name = data.name.removeDashes().capitaliseEachWord();
        this.description = data.effect_entries
            .find(e => common_1.NameURL.fromObj(e.language).name == "En")
            .effect;
        this.type = common_1.NameURL.fromObj(data.type).name;
        this.damage_class = common_1.NameURL.fromObj(data.damage_class).name;
        this.power = data.power;
        this.pp = data.pp;
        this.target = common_1.NameURL.fromObj(data.target).name;
        const meta = data.meta;
        this.ailment = common_1.NameURL.fromObj(meta.ailment).name;
        this.ailment_chance = meta.ailment_chance;
        this.crit_rate = meta.crit_rate;
        this.drain = meta.drain;
        this.healing = meta.healing;
        this.max_hits = meta.max_hits;
        this.max_turns = meta.max_turns;
        this.min_hits = meta.min_hits;
        this.min_turns = meta.min_turns;
        this.stat_chance = meta.stat_chance;
        this.swap_status_effect_values();
    }
    swap_status_effect_values() {
        this.description = this.description.replace('$effect_chance%', `${this.ailment_chance}%`);
        this.description = this.description.replace('  /g', ' ');
    }
    possiblyAdd(to, key, val) {
        if (val != undefined && val != null && val != 0 && val != "None") {
            to.push({ "order": to.length, "name": key, "value": `${val}` });
        }
    }
    flattenedData() {
        const data = [];
        this.possiblyAdd(data, "Name", this.name);
        this.possiblyAdd(data, "Description", this.description);
        this.possiblyAdd(data, "Type", this.type);
        this.possiblyAdd(data, "Damage class", this.damage_class);
        this.possiblyAdd(data, "Power", this.power);
        this.possiblyAdd(data, "PP", this.pp);
        this.possiblyAdd(data, "Target", this.target);
        this.possiblyAdd(data, "Ailment", this.ailment);
        this.possiblyAdd(data, "Ailment chance", this.ailment_chance);
        this.possiblyAdd(data, "Crit rate", this.crit_rate);
        this.possiblyAdd(data, "Drain", this.drain);
        this.possiblyAdd(data, "Healing", this.healing);
        this.possiblyAdd(data, "Max hits", this.max_hits);
        this.possiblyAdd(data, "Min hits", this.min_hits);
        this.possiblyAdd(data, "Max turns", this.max_turns);
        this.possiblyAdd(data, "Min turns", this.min_turns);
        this.possiblyAdd(data, "Stat chance", this.stat_chance);
        return data;
    }
}
exports.Move = Move;
//# sourceMappingURL=move.js.map