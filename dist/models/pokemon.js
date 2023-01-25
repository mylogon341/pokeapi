"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePokemon = exports.EvolutionDetail = exports.EvolutionChain = exports.PokemonSpecies = exports.Pokemon = exports.BasicPokemon = void 0;
const stats_1 = require("./stats");
require("../Helpers");
const types_1 = require("./types");
const evolutionDetails_1 = require("./evolutionDetails");
const move_1 = require("./move");
const common_1 = require("./common");
const sprites_1 = require("./sprites");
const lookup_csv_1 = __importDefault(require("lookup-csv"));
const lookupTable = (0, lookup_csv_1.default)('poke_ipa.csv', 'id');
class Clearable {
    clear() { console.log("empty implementation"); }
}
class BasicPokemon {
    constructor(body) {
        this.name = body.name.removeDashes().capitaliseEachWord();
        this.id = body.url.versionNumberFromUrl();
    }
}
exports.BasicPokemon = BasicPokemon;
function getIpaName(id) {
    return lookupTable.get(id).ipa;
}
class BasePokemon extends Clearable {
    constructor(body) {
        super();
        this.id = body.id;
        this.ipa_name = getIpaName(this.id);
        this.moves = body.moves.map(m => new move_1.BasicMove(m));
        this.name = body.name.removeDashes().capitaliseEachWord();
        this.species_url = body.species.url;
        this.sprite = new sprites_1.Sprites(body);
        this.stats = body.stats.map(s => new stats_1.Stats(s));
        this.types = body.types.map(t => new types_1.Type(t)).map(t => t.name);
        this.ability_info = body.abilities.map(a => {
            return {
                "id": a.ability.url.versionNumberFromUrl(),
                "hidden": a.is_hidden
            };
        });
    }
    clear() {
        this.species_url = undefined;
        this.ability_info = undefined;
    }
}
exports.BasePokemon = BasePokemon;
class PokemonSpecies {
    constructor(body) {
        var _a;
        this.is_legendary = body.is_legendary;
        this.is_mythical = body.is_mythical;
        if (body.evolution_chain != null) {
            this.evolution_chain_url = body.evolution_chain.url;
        }
        else {
            this.evolution_chain_url = null;
        }
        if (body.evolves_from_species) {
            this.evolves_from = new BasicPokemon(body.evolves_from_species);
        }
        if (body.growth_rate != null) {
            this.growth_rate = common_1.NameURL.fromObj(body.growth_rate);
            this.growth_rate.name = this.growth_rate.name.capitaliseEachWord();
        }
        else {
            this.growth_rate = null;
        }
        const descriptions = body.flavor_text_entries;
        if (descriptions.length > 0) {
            const english = descriptions
                .filter(i => i.language.name === "en")
                .sort((a, b) => {
                return a.version.url.versionNumberFromUrl() - b.version.url.versionNumberFromUrl();
            })[0];
            this.dex_entry = english.flavor_text.removeLinebreaks();
        }
        else {
            this.dex_entry = "No pokédex entry provided yet";
        }
        this.jap_name = body.names.find(v => v.language.name == "ja").name;
        this.roomaji_name = (_a = body.names.find(v => v.language.name == "roomaji")) === null || _a === void 0 ? void 0 : _a.name;
    }
}
exports.PokemonSpecies = PokemonSpecies;
////
class Chain {
    constructor(body) {
        this.to = body.evolves_to.map(t => new Chain(t));
        this.details = body.evolution_details.map(d => new evolutionDetails_1.EvolutionDetails(d));
        this.species = new BasicPokemon(body.species);
    }
}
function flattenChain(chains, prop) {
    return chains.reduce((acc, x) => {
        acc = acc.concat(prop(x));
        if (x.to) {
            acc = acc.concat(flattenChain(x.to, prop));
            x.to = [];
        }
        return acc;
    }, []);
}
class EvolutionChain extends Clearable {
    constructor(body) {
        super();
        const evo = new Chain(body.chain);
        this.pokemons = flattenChain(evo.to, x => x.species);
        this.pokemons.push(evo.species);
    }
}
exports.EvolutionChain = EvolutionChain;
class EvolutionDetail {
    constructor(body, searchId) {
        const evo = new Chain(body.chain);
        const first = { bPokemon: evo.species, detail: evo.details };
        const deets = flattenChain(evo.to, (x => {
            const pd = { bPokemon: x.species, detail: x.details };
            return pd;
        }));
        deets.push(first);
        const deet = deets.find(x => x.bPokemon.id == searchId);
        if (deet != undefined) {
            this.detail = deet.detail;
        }
    }
}
exports.EvolutionDetail = EvolutionDetail;
class Pokemon {
    constructor(base, species, abilities, chain) {
        this.base = base;
        this.species = species;
        this.chain = chain === null || chain === void 0 ? void 0 : chain.pokemons;
        this.abilities = abilities;
        const clearCheck = (i) => i.clear !== undefined;
        const properties = [this.base, this.species, this.chain, this.abilities];
        properties.forEach(a => {
            if (a != undefined && clearCheck(a)) {
                a.clear();
            }
        });
    }
}
exports.Pokemon = Pokemon;
//# sourceMappingURL=pokemon.js.map