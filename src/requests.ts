import axios from "axios"
import { Ability } from "./models/ability"
import { AllGenerations, Generation } from "./models/generation"
import { BasicItem, Item } from "./models/item"
import { AbilityInfo, BasicPokemon, EvolutionChain, EvolutionDetail, Pokemon, PokemonSpecies, BasePokemon } from "./models/pokemon"

const baseUrl = "https://pokeapi.co/api/v2"

async function getAllAbilities(infos: AbilityInfo[]): Promise<Ability[]> {
    return new Promise((success, reject) => {

        let returningValue: Ability[] = []
        infos.forEach(info => {
            axios.get(`${baseUrl}/ability/${info.id}`)
                .then(response => new Ability(response.data, info.hidden))
                .then(a => returningValue.push(a))
                .then(() => {
                    if (returningValue.length == infos.length) {
                        success(returningValue)
                    }
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    })
}

async function pokemon(pokemon: string | number): Promise<Pokemon> {
    let basePokemon: BasePokemon
    let pokeSpecies: PokemonSpecies
    let chainData: EvolutionChain

    return new Promise((success, reject) => {
        axios.get(`${baseUrl}/pokemon/${pokemon}`)
            .then(body => new BasePokemon(body.data))
            .then(base => {
                basePokemon = base
                return base.species_url
            })
            .then(speciesUrl => axios.get(speciesUrl))
            .then(speciesResponse => new PokemonSpecies(speciesResponse.data))
            .then(species => {
                pokeSpecies = species
                return species.evolution_chain_url
            })
            .then(chainUrl => axios.get(chainUrl))
            .then(chainResponse => {
                chainData = new EvolutionChain(chainResponse.data)
                return getAllAbilities(basePokemon.ability_info)
            })
            .then(abilities => success(new Pokemon(basePokemon, pokeSpecies, chainData, abilities)))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

async function getEvolutionDetails(pokemon: string | number): Promise<any> {
    let pokeIndex: number
    return new Promise((success, reject) => {
        axios.get(`${baseUrl}/pokemon/${pokemon}`)
            .then(body => new BasePokemon(body.data))
            .then(base => {
                pokeIndex = base.id
                return base.species_url
            })
            .then(url => axios.get(url))
            .then(res => new PokemonSpecies(res.data))
            .then(species => axios.get(species.evolution_chain_url))
            .then(res => new EvolutionDetail(res.data, pokeIndex))
            .then(eDetail => success(eDetail.detail))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

//// Items

async function allItems() {
    return new Promise((success, reject) => {
        axios.get(`${baseUrl}/item?limit=2000`)
            .then(body => {
                success(body.data.results
                    .map(i => new BasicItem(i))
                )
            })
            .catch(err => reject(err))
    })
}

async function getItem(item: number | string) {
    return new Promise((success, reject) => {
        axios.get(`${baseUrl}/item/${item}`)
            .then(body => new Item(body.data))
            .then(item => success(item))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

////
async function listAll(): Promise<Generation[]> {
    return new Promise((success, reject) => {

        let allGenerationData: Generation[] = []

        axios.get(`${baseUrl}/generation`)
            .then(body => new AllGenerations(body))
            .then(gens => {
                gens.generations.forEach(element => {
                    axios.get(element.url)
                    .then(response => {
                        allGenerationData.push(new Generation(response.data))

                        if (allGenerationData.length == gens.generations.length) {
                            success(allGenerationData)
                        }
                    })
                    .catch(e => {
                        console.log(e)
                        reject(e)
                    })
                });
            })
            .catch(e => {
                console.log(e)
                reject(e)
            })
    })
}

export { listAll, pokemon, getEvolutionDetails, allItems, getItem }