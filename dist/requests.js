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
exports.pokemon = exports.listAll = void 0;
const axios_1 = __importDefault(require("axios"));
const pokemon_1 = require("./models/pokemon");
const baseUrl = "https://pokeapi.co/api/v2/";
function pokemon(index) {
    return __awaiter(this, void 0, void 0, function* () {
        let basePokemon;
        let pokeSpecies;
        console.log("going to call pokemon with id " + index);
        return new Promise((success, reject) => {
            axios_1.default.get(baseUrl + "pokemon/" + index)
                .then(body => new pokemon_1.BasePokemon(body.data))
                .then(base => {
                basePokemon = base;
                return base.species_url;
            })
                .then(speciesUrl => axios_1.default.get(speciesUrl))
                .then(speciesResponse => new pokemon_1.PokemonSpecies(speciesResponse.data))
                .then(species => {
                pokeSpecies = species;
                return species.evolution_chain_url;
            })
                .then(chainUrl => axios_1.default.get(chainUrl))
                .then(chainResponse => new pokemon_1.EvolutionChain(chainResponse.data))
                .then(chain => success(new pokemon_1.Pokemon(basePokemon, pokeSpecies, chain)))
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    });
}
exports.pokemon = pokemon;
////
function listAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((success, reject) => {
            axios_1.default.get(baseUrl + "pokemon?limit=1200")
                .then(body => {
                success(body.data.results
                    .map(obj => new pokemon_1.BasicPokemon(obj)));
            }).catch(err => reject(err));
        });
    });
}
exports.listAll = listAll;
//# sourceMappingURL=requests.js.map