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
        const returningValues = [];
        for (const info of infos) {
            const abilityRes = yield api.get(`/ability/${info.id}`);
            const ability = new ability_1.Ability(abilityRes.data, info.hidden);
            returningValues.push(ability);
        }
        return returningValues;
    });
}
function pokemon(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        const pokeRes = yield api.get(`/pokemon/${pokemon}`);
        const basePoke = new pokemon_1.BasePokemon(pokeRes.data);
        const speciesRes = yield api.get(basePoke.species_url);
        const species = new pokemon_1.PokemonSpecies(speciesRes.data);
        let evolution_chain = null;
        if (species.evolution_chain_url != null) {
            const chainRes = yield api.get(species.evolution_chain_url);
            evolution_chain = new pokemon_1.EvolutionChain(chainRes.data);
        }
        const abilities = yield getAllAbilities(basePoke.ability_info);
        return new pokemon_1.Pokemon(basePoke, species, abilities, evolution_chain);
    });
}
exports.pokemon = pokemon;
function getEvolutionDetails(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield api.get(`/pokemon/${pokemon}`);
        const base = new pokemon_1.BasePokemon(body.data);
        const pokeIndex = base.id;
        const speciesRes = yield api.get(base.species_url);
        const species = new pokemon_1.PokemonSpecies(speciesRes.data);
        if (species.evolution_chain_url == null) {
            return [];
        }
        const evolutionRes = yield api.get(species.evolution_chain_url);
        return new pokemon_1.EvolutionDetail(evolutionRes.data, pokeIndex).detail;
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
        const encRes = yield api.get(`/pokemon/${pokemon}/encounters`);
        const info = encRes.data.map(d => new encounterDetail_1.EncounterInfo(d));
        return (0, encounterDetail_1.sortEncounterDetails)(info);
    });
}
exports.getEncounterDetails = getEncounterDetails;
////
function listAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const allGens = yield getAllGenerationData();
        const offset = get_highest_index_number(allGens);
        const alolanPoke = yield getAlolanPokemon(offset);
        const genSeven = allGens.find(g => g.id == 7);
        genSeven.pokemon = genSeven.pokemon.concat(alolanPoke);
        // allGens.find(g => g.id == 7).pokemon.concat(alolanPoke)
        return allGens;
    });
}
exports.listAll = listAll;
function getAllGenerationData() {
    return __awaiter(this, void 0, void 0, function* () {
        const genRes = yield api.get('/generation');
        const allGens = new generation_1.AllGenerations(genRes);
        const genUrlPromises = allGens.generations.map(g => api.get(g.url));
        const genResponses = yield Promise.all(genUrlPromises);
        const genData = genResponses.map(res => res.data);
        return genData.map(data => new generation_1.Generation(data));
    });
}
function getMove(moveId) {
    return __awaiter(this, void 0, void 0, function* () {
        const moveRes = yield api.get(`/move/${moveId}`);
        const move = new move_1.Move(moveRes.data);
        return move.flattenedData();
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
        const alolanRes = yield api.get(`/pokemon?limit=1000&offset=${offset}`);
        const alolanResults = alolanRes.data.results;
        return alolanResults.map(data => new pokemon_1.BasicPokemon(data));
    });
}
//# sourceMappingURL=requests.js.map