"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortEncounterDetails = exports.GameEncounters = exports.EncounterInfo = exports.VersionEncounterDetail = exports.Encounter = void 0;
const common_1 = require("./common");
class Encounter {
    constructor(data) {
        this.min_level = Number(data.min_level);
        this.max_level = Number(data.max_level);
        this.chance = Number(data.chance);
        this.method = common_1.NameURL.fromObj(data.method).name;
        this.condition_values =
            data
                .condition_values
                .map(obj => common_1.NameURL.fromObj(obj))
                .map((obj) => obj.name);
    }
}
exports.Encounter = Encounter;
class VersionEncounterDetail {
    constructor(data) {
        this.version = common_1.NameURL.fromObj(data.version);
        this.max_chance;
        this.encounter_details = data.encounter_details.map(obj => new Encounter(obj));
    }
}
exports.VersionEncounterDetail = VersionEncounterDetail;
class EncounterInfo {
    constructor(data) {
        this.location_area = common_1.NameURL.fromObj(data.location_area);
        this.version_details = data.version_details.map(vd => new VersionEncounterDetail(vd));
    }
}
exports.EncounterInfo = EncounterInfo;
class EncounterLocation {
    constructor(details, location) {
        this.version_encounter_detail = details;
        this.location = location;
    }
}
class GameEncounters {
    constructor(id, name, encounter) {
        this.id = id;
        this.game = name;
        this.encounters = [encounter];
    }
}
exports.GameEncounters = GameEncounters;
function sortEncounterDetails(details) {
    const games = [];
    details.forEach(detail => {
        detail.version_details.forEach(vDeet => {
            const existing = games
                .filter(item => item.game === vDeet.version.name);
            const name = vDeet.version.name;
            const id = vDeet.version.url.versionNumberFromUrl();
            vDeet.version = undefined;
            if (existing.length === 1) {
                existing[0].encounters.push(new EncounterLocation(vDeet.encounter_details, detail.location_area.name));
            }
            else {
                games.push(new GameEncounters(id, name, new EncounterLocation(vDeet.encounter_details, detail.location_area.name)));
            }
        });
    });
    return games;
}
exports.sortEncounterDetails = sortEncounterDetails;
//# sourceMappingURL=encounterDetail.js.map