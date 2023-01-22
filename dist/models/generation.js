"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generation = exports.AllGenerations = void 0;
const common_1 = require("./common");
const pokemon_1 = require("./pokemon");
class AllGenerations {
    constructor(response) {
        this.generations = response
            .data
            .results
            .map(g => common_1.NameURL.fromObj(g));
    }
}
exports.AllGenerations = AllGenerations;
class Generation {
    constructor(data) {
        this.id = data.id;
        this.region_name = data.main_region.name.capitaliseFirstLetter();
        this.gen_name = data.name.removeDashes().toUpperCase();
        this.pokemon = data.pokemon_species.map(p => new pokemon_1.BasicPokemon(p));
        this.version_groups = data.version_groups.map(v => common_1.NameURL.fromObj(v));
    }
}
exports.Generation = Generation;
//# sourceMappingURL=generation.js.map