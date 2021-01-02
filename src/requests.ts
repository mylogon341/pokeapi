import axios from "axios"
import { Ability } from "./models/ability"
import { AbilityInfo, BasicPokemon, EvolutionChain, EvolutionDetail, Pokemon, PokemonSpecies, BasePokemon } from "./models/pokemon"

const baseUrl = "https://pokeapi.co/api/v2/"

async function getAllAbilities(infos: AbilityInfo[]): Promise<Ability[]> {
    return new Promise((success, reject) => {

        let returningValue: Ability[] = []
        infos.forEach(info => {
            axios.get(`${baseUrl}ability/${info.id}`)
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

async function pokemon(index: string): Promise<Pokemon> {
    let basePokemon: BasePokemon
    let pokeSpecies: PokemonSpecies
    let chainData: EvolutionChain

    return new Promise((success, reject) => {
        axios.get(baseUrl + "pokemon/" + index)
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

async function getEvolutionDetails(id: string): Promise<any> {
    return new Promise((success, reject) => {
        axios.get(`${baseUrl}pokemon/${id}`)
            .then(body => new BasePokemon(body.data))
            .then(base => axios.get(base.species_url))
            .then(res => new PokemonSpecies(res.data))
            .then(species => axios.get(species.evolution_chain_url))
            .then(res => new EvolutionDetail(res.data, Number(id)))
            .then(chain => success(chain.detail))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

////
async function listAll(): Promise<BasicPokemon[]> {
    return new Promise((success, reject) => {
        axios.get(baseUrl + "pokemon?limit=1200")
            .then(body => {
                success(body.data.results
                    .map(obj => new BasicPokemon(obj))
                )
            }).catch(err => reject(err))
    })
}

export { listAll, pokemon, getEvolutionDetails }