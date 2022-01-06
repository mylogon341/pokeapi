"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMove = exports.getEncounterDetails = exports.getItem = exports.allItems = exports.getEvolutionDetails = exports.pokemon = exports.listAll = exports.clearRedisCache = void 0;
const axios_cache_adapter_1 = require("axios-cache-adapter");
const redis_1 = __importDefault(require("redis"));
const ability_1 = require("./models/ability");
const encounterDetail_1 = require("./models/encounterDetail");
const generation_1 = require("./models/generation");
const item_1 = require("./models/item");
const move_1 = require("./models/move");
const pokemon_1 = require("./models/pokemon");
const client = redis_1.default.createClient({
    url: 'redis://192.168.1.194:6379'
});
const store = new axios_cache_adapter_1.RedisStore(client);
const api = (0, axios_cache_adapter_1.setup)({
    // `axios` options
    baseURL: 'https://pokeapi.co/api/v2',
    // `axios-cache-adapter` options
    cache: {
        maxAge: 4 * 7 * 24 * 60 * 60 * 1000,
        store // Pass `RedisStore` store to `axios-cache-adapter`
    }
});
function clearRedisCache(complete) {
    client.flushall('ASYNC', complete);
}
exports.clearRedisCache = clearRedisCache;
function getAllAbilities(infos) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            const returningValue = [];
            infos.forEach(info => {
                api.get(`/ability/${info.id}`)
                    .then(response => new ability_1.Ability(response.data, info.hidden))
                    .then(a => returningValue.push(a))
                    .then(() => {
                    if (returningValue.length == infos.length) {
                        success(returningValue);
                    }
                })
                    .catch(err => {
                    console.error(err);
                    reject(err);
                });
            });
        });
    });
}
function pokemon(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        let basePokemon;
        let pokeSpecies;
        let chainData;
        return new Promise((success, reject) => {
            api.get(`/pokemon/${pokemon}`)
                .then(body => new pokemon_1.BasePokemon(body.data))
                .then(base => {
                basePokemon = base;
                return base.species_url;
            })
                .then(speciesUrl => api.get(speciesUrl))
                .then(speciesResponse => new pokemon_1.PokemonSpecies(speciesResponse.data))
                .then(species => {
                pokeSpecies = species;
                return species.evolution_chain_url;
            })
                .then(chainUrl => api.get(chainUrl))
                .then(chainResponse => {
                chainData = new pokemon_1.EvolutionChain(chainResponse.data);
                return getAllAbilities(basePokemon.ability_info);
            })
                .then(abilities => success(new pokemon_1.Pokemon(basePokemon, pokeSpecies, chainData, abilities)))
                .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
exports.pokemon = pokemon;
function getEvolutionDetails(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        let pokeIndex;
        return new Promise((success, reject) => {
            api.get(`/pokemon/${pokemon}`)
                .then(body => new pokemon_1.BasePokemon(body.data))
                .then(base => {
                pokeIndex = base.id;
                return base.species_url;
            })
                .then(url => api.get(url))
                .then(res => new pokemon_1.PokemonSpecies(res.data))
                .then(species => api.get(species.evolution_chain_url))
                .then(res => new pokemon_1.EvolutionDetail(res.data, pokeIndex))
                .then(eDetail => { var _a; return success((_a = eDetail.detail) !== null && _a !== void 0 ? _a : []); })
                .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
exports.getEvolutionDetails = getEvolutionDetails;
//// Items
function allItems() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/item?limit=2000`)
                .then(body => {
                success(body.data.results
                    .map(i => new item_1.BasicItem(i)));
            })
                .catch(err => reject(err));
        });
    });
}
exports.allItems = allItems;
function getItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/item/${item}`)
                .then(body => new item_1.Item(body.data))
                .then(item => success(item))
                .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
exports.getItem = getItem;
function getEncounterDetails(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/pokemon/${pokemon}/encounters`)
                .then(body => body.data.map(d => new encounterDetail_1.EncounterInfo(d)))
                .then((info) => (0, encounterDetail_1.sortEncounterDetails)(info))
                .then(sorted => success(sorted))
                .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
exports.getEncounterDetails = getEncounterDetails;
////
function listAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            let returningGens;
            getAllGenerationData()
                .then(gens => {
                returningGens = gens;
                const offset = get_highest_index_number(gens);
                return getAlolanPokemon(offset);
            })
                .then(pokes => {
                const gen7 = returningGens.find(g => g.id == 7);
                gen7.pokemon = gen7.pokemon.concat(pokes);
                success(returningGens);
            })
                .catch(err => reject(err));
        });
    });
}
exports.listAll = listAll;
function getAllGenerationData() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/generation`)
                .then(body => new generation_1.AllGenerations(body))
                .then(gens => gens.generations)
                .then(gens => gens.map(g => api.get(g.url)))
                .then(gets => Promise.all(gets))
                .then(responses => responses.map(r => r.data))
                .then(datas => datas.map(d => new generation_1.Generation(d)))
                .then(gens => success(gens))
                .catch(e => {
                console.error(e);
                reject(e);
            });
        });
    });
}
function getMove(move) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/move/${move}`)
                .then(response => response.data)
                .then(data => new move_1.Move(data))
                .then(move => success(move.flattenedData()))
                .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
exports.getMove = getMove;
function get_highest_index_number(gens) {
    const pokes = gens
        .map(g => g.pokemon)
        .reduce((prev, pokes) => prev.concat(pokes));
    return Math.max(0, ...pokes.map(p => p.id));
}
function getAlolanPokemon(offset) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            api.get(`/pokemon?limit=1000&offset=${offset}`)
                .then(response => response.data.results)
                .then(pokemonData => pokemonData.map(p => new pokemon_1.BasicPokemon(p)))
                .then(pokes => success(pokes))
                .catch(e => reject(e));
        });
    });
}
//# sourceMappingURL=requests.js.map