// import axios from "axios"

import { setup, RedisStore } from 'axios-cache-adapter'
import { response } from 'express'
import redis from 'redis'


import { Ability } from "./models/ability"
import { EncounterInfo, GameEncounters, sortEncounterDetails } from "./models/encounterDetail"
import { AllGenerations, Generation } from "./models/generation"
import { BasicItem, Item } from "./models/item"
import { MoveInfo } from "./models/moveInfo"
import { AbilityInfo, EvolutionChain, EvolutionDetail, Pokemon, PokemonSpecies, BasePokemon, BasicPokemon } from "./models/pokemon"

const client = redis.createClient({
    url: 'redis://192.168.1.97:6379'
})

const store = new RedisStore(client)
const api = setup({
    // `axios` options
    baseURL: 'https://pokeapi.co/api/v2',
    // `axios-cache-adapter` options
    cache: {
        maxAge: 4 * 7 * 24 * 60 * 60 * 1000, // 4 weeks
        store // Pass `RedisStore` store to `axios-cache-adapter`
    }
})

async function getAllAbilities(infos: AbilityInfo[]): Promise<Ability[]> {
    return new Promise((success, reject) => {

        const returningValue: Ability[] = []
        infos.forEach(info => {
            api.get(`/ability/${info.id}`)
                .then(response => new Ability(response.data, info.hidden))
                .then(a => returningValue.push(a))
                .then(() => {
                    if (returningValue.length == infos.length) {
                        success(returningValue)
                    }
                })
                .catch(err => {
                    console.error(err)
                    reject(err)
                })
        })
    })
}

async function getMoveInfo(id: number | string): Promise<MoveInfo> {
    return new Promise((success, reject) => {
        api.get(`/move/${id}`)
            .then(body => new MoveInfo(body.data))
            .then(info => success(info))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

async function pokemon(pokemon: string | number): Promise<Pokemon> {
    let basePokemon: BasePokemon
    let pokeSpecies: PokemonSpecies
    let chainData: EvolutionChain

    return new Promise((success, reject) => {
        api.get(`/pokemon/${pokemon}`)
            .then(body => new BasePokemon(body.data))
            .then(base => {
                basePokemon = base
                return base.species_url
            })
            .then(speciesUrl => api.get(speciesUrl))
            .then(speciesResponse => new PokemonSpecies(speciesResponse.data))
            .then(species => {
                pokeSpecies = species
                return species.evolution_chain_url
            })
            .then(chainUrl => api.get(chainUrl))
            .then(chainResponse => {
                chainData = new EvolutionChain(chainResponse.data)
                return getAllAbilities(basePokemon.ability_info)
            })
            .then(abilities => success(new Pokemon(basePokemon, pokeSpecies, chainData, abilities)))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

async function getEvolutionDetails(pokemon: string | number): Promise<any> {
    let pokeIndex: number
    return new Promise((success, reject) => {
        api.get(`/pokemon/${pokemon}`)
            .then(body => new BasePokemon(body.data))
            .then(base => {
                pokeIndex = base.id
                return base.species_url
            })
            .then(url => api.get(url))
            .then(res => new PokemonSpecies(res.data))
            .then(species => api.get(species.evolution_chain_url))
            .then(res => new EvolutionDetail(res.data, pokeIndex))
            .then(eDetail => success(eDetail.detail))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

//// Items

async function allItems(): Promise<BasicItem[]> {
    return new Promise((success, reject) => {
        api.get(`/item?limit=2000`)
            .then(body => {
                success(body.data.results
                    .map(i => new BasicItem(i))
                )
            })
            .catch(err => reject(err))
    })
}

async function getItem(item: number | string): Promise<Item> {
    return new Promise((success, reject) => {
        api.get(`/item/${item}`)
            .then(body => new Item(body.data))
            .then(item => success(item))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

async function getEncounterDetails(pokemon: number | string): Promise<GameEncounters[]> {
    return new Promise((success, reject) => {
        api.get(`/pokemon/${pokemon}/encounters`)
            .then(body => body.data.map(d => new EncounterInfo(d)))
            .then((info: EncounterInfo[]) => sortEncounterDetails(info))
            .then(sorted => success(sorted))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

////
async function listAll(): Promise<Generation[]> {
    return new Promise((success, reject) => {

        let returningGens: Generation[]

        getAllGenerationData()
            .then(gens => {
                returningGens = gens
                const offset = get_highest_index_number(gens)
                return getAlolanPokemon(offset)
            })
            .then(pokes => {
                const gen7 = returningGens.find(g => g.id == 7)
                gen7.pokemon = gen7.pokemon.concat(pokes)
                success(returningGens)
            })
            .catch(err => reject(err))
    })
}

async function getAllGenerationData(): Promise<Generation[]> {
    return new Promise((success, reject) => {
        api.get(`/generation`)
            .then(body => new AllGenerations(body))
            .then(gens => gens.generations)
            .then(gens => gens.map(g => api.get(g.url)))
            .then(gets => Promise.all(gets))
            .then(responses => responses.map(r => r.data))
            .then(datas => datas.map(d => new Generation(d)))
            .then(gens => success(gens))
            .catch(e => {
                console.error(e)
                reject(e)
            })
    })
}

function get_highest_index_number(gens: Generation[]): number {
    const pokes = gens
        .map(g => g.pokemon)
        .reduce((prev, pokes) => prev.concat(pokes))
    return Math.max(0, ...pokes.map(p => p.id))
}

async function getAlolanPokemon(offset: number): Promise<BasicPokemon[]> {
    return new Promise((success, reject) => {
        api.get(`/pokemon?limit=1000&offset=${offset}`)
            .then(response => response.data.results)
            .then(pokemonData => pokemonData.map(p => new BasicPokemon(p)))
            .then(pokes => success(pokes))
            .catch(e => reject(e))
    })
}

export { listAll, pokemon, getEvolutionDetails, allItems, getItem, getEncounterDetails, getMoveInfo }