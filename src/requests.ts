import { setup, RedisStore } from 'axios-cache-adapter'
import redis from 'redis'

import { Ability } from "./models/ability"
import { EncounterInfo, GameEncounters, sortEncounterDetails } from "./models/encounterDetail"
import { EvolutionDetails } from './models/evolutionDetails'
import { AllGenerations, Generation } from "./models/generation"
import { BasicItem, Item } from "./models/item"
import { Move } from './models/move'
import { AbilityInfo, EvolutionChain, EvolutionDetail, Pokemon, PokemonSpecies, BasePokemon, BasicPokemon } from "./models/pokemon"

const client = redis.createClient({
    url: 'redis://192.168.1.194:6379'
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

function clearRedisCache(complete: () => void): void {
    client.flushall('ASYNC', complete)
}

async function getAllAbilities(infos: AbilityInfo[]): Promise<Ability[]> {
    const returningValues: Ability[] = []

    for (const info of infos) {
        const abilityRes = await api.get(`/ability/${info.id}`)
        const ability = new Ability(abilityRes.data, info.hidden)
        returningValues.push(ability)
    }

    return returningValues
}

async function pokemon(pokemon: string | number): Promise<Pokemon> {

    const pokeRes = await api.get(`/pokemon/${pokemon}`)
    const basePoke = new BasePokemon(pokeRes.data)
    const speciesRes = await api.get(basePoke.species_url)
    const species = new PokemonSpecies(speciesRes.data)
    const chainRes = await api.get(species.evolution_chain_url)
    const evolutionChain = new EvolutionChain(chainRes.data)
    const abilities = await getAllAbilities(basePoke.ability_info)
    return new Pokemon(basePoke, species, evolutionChain, abilities)
}

async function getEvolutionDetails(pokemon: string | number): Promise<EvolutionDetails[]> {
    
    const body = await api.get(`/pokemon/${pokemon}`)
    const base = new BasePokemon(body.data)
    const pokeIndex = base.id
    const speciesRes = await api.get(base.species_url)
    const species = new PokemonSpecies(speciesRes.data)
    const evolutionRes = await api.get(species.evolution_chain_url)
    return new EvolutionDetail(evolutionRes.data, pokeIndex).detail
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

    const encRes = await api.get(`/pokemon/${pokemon}/encounters`)
    const info = encRes.data.map(d => new EncounterInfo(d))
    return sortEncounterDetails(info)
}

////
async function listAll(): Promise<Generation[]> {
    const allGens = await getAllGenerationData()
    const offset = get_highest_index_number(allGens)
    const alolanPoke = await getAlolanPokemon(offset)
    const genSeven = allGens.find(g => g.id == 7)
    genSeven.pokemon = genSeven.pokemon.concat(alolanPoke)
    // allGens.find(g => g.id == 7).pokemon.concat(alolanPoke)
    return allGens
}

async function getAllGenerationData(): Promise<Generation[]> {

    const genRes = await api.get('/generation')
    const allGens = new AllGenerations(genRes)
    const genUrlPromises = allGens.generations.map(g => api.get(g.url))
    const genResponses = await Promise.all(genUrlPromises)
    const genData = genResponses.map(res => res.data)
    return genData.map(data => new Generation(data))
}

async function getMove(moveId: string): Promise<Record<string, string | number>[]> {

    const moveRes = await api.get(`/move/${moveId}`)
    const move = new Move(moveRes.data)
    return move.flattenedData()
}

function get_highest_index_number(gens: Generation[]): number {
    const pokes = gens
        .map(g => g.pokemon)
        .reduce((prev, pokes) => prev.concat(pokes))
    return Math.max(0, ...pokes.map(p => p.id))
}

async function getAlolanPokemon(offset: number): Promise<BasicPokemon[]> {

    const alolanRes = await api.get(`/pokemon?limit=1000&offset=${offset}`)
    const alolanResults = alolanRes.data.results
    return alolanResults.map(data => new BasicPokemon(data))
}

export { clearRedisCache, listAll, pokemon, getEvolutionDetails, allItems, getItem, getEncounterDetails, getMove }
