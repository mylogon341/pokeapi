"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePokemon = exports.EvolutionChain = exports.PokemonSpecies = exports.Pokemon = exports.BasicPokemon = void 0;
const moves_1 = require("./moves");
const stats_1 = require("./stats");
const Helpers_1 = require("../Helpers");
const types_1 = require("./types");
class BasicPokemon {
    constructor(body) {
        this.name = Helpers_1.capitalizeFirstLetter(body.name);
        this.url = body.url;
        this.index = Helpers_1.versionNumberFromUrl(body.url);
    }
}
exports.BasicPokemon = BasicPokemon;
class BasePokemon {
    constructor(body) {
        this.id = body.id;
        this.moves = body.moves.map(m => new moves_1.Move(m));
        this.name = Helpers_1.capitalizeFirstLetter(body.name);
        this.species_url = body.species.url;
        this.official_artwork = body.sprites.other["official-artwork"]["front_default"];
        this.stats = body.stats.map(s => new stats_1.Stats(s));
        this.types = body.types.map(t => new types_1.Type(t));
        this.abilityInfo = body.abilities.map(a => {
            const num = Helpers_1.versionNumberFromUrl(a.ability.url);
            const isHidden = a.is_hidden;
            return { "id": num, "hidden": isHidden };
        });
        console.log("created pokemon with abilityinfo " + JSON.stringify(this.abilityInfo));
    }
}
exports.BasePokemon = BasePokemon;
class PokemonSpecies {
    constructor(body) {
        this.is_legendary = body.is_legendary;
        this.is_mythical = body.is_mythical;
        this.evolution_chain_url = body.evolution_chain.url;
        if (body.evolves_from_species) {
            this.evolves_from = new BasicPokemon(body.evolves_from_species);
        }
    }
}
exports.PokemonSpecies = PokemonSpecies;
////
class Chain {
    constructor(body) {
        this.to = body.evolves_to.map(t => new Chain(t));
        this.species = new BasicPokemon(body.species);
    }
}
function flattenChain(chains) {
    return chains.reduce((acc, x) => {
        acc = acc.concat(x.species);
        if (x.to) {
            acc = acc.concat(flattenChain(x.to));
            x.to = [];
        }
        return acc;
    }, []);
}
class EvolutionChain {
    constructor(body) {
        const evo = new Chain(body.chain);
        this.pokemons = flattenChain(evo.to);
        this.pokemons.push(evo.species);
    }
}
exports.EvolutionChain = EvolutionChain;
class Pokemon {
    constructor(base, species, chain, abilities) {
        this.base = base;
        this.species = species;
        this.chain = chain;
        this.abilities = abilities;
        console.log(`this pokemon has ${abilities.length} abilities`);
    }
}
exports.Pokemon = Pokemon;
//# sourceMappingURL=pokemon.js.map