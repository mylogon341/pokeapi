import { Stats } from "./stats"
import "../Helpers"
import { Type } from "./types"
import { Ability } from "./ability"
import { EvolutionDetails } from "./evolutionDetails"
import { Move } from "./moves"
import { NameURL } from "./common"

class Clearable {
    clear(): void { console.log("empty implementation") }
}

class BasicPokemon {
    name: string
    id: number
    constructor(body: Record<string, string>) {

        this.name = body.name.capitaliseFirstLetter()
        this.id = body.url.versionNumberFromUrl()
    }
}

type AbilityInfo = { id: number, hidden: boolean }

class BasePokemon extends Clearable {
    id: number
    name: string
    moves: Move[]
    species_url: string | null
    official_artwork: string
    stats: Stats[]
    types: string[]
    ability_info: AbilityInfo[]

    constructor(body: Record<string, any>) {
        super()
        this.id = body.id
        this.moves = body.moves.map(m => new Move(m))
        this.name = body.name.capitaliseFirstLetter()
        this.species_url = body.species.url
        this.official_artwork = body.sprites.other["official-artwork"]["front_default"]
        this.stats = body.stats.map(s => new Stats(s))
        this.types = body.types.map(t => new Type(t)).map(t => t.name)
        this.ability_info = body.abilities.map(a => {
            return {
                "id": a.ability.url.versionNumberFromUrl(),
                "hidden": a.is_hidden
            }
        })
    }

    clear(): void {
        this.species_url = undefined
        this.ability_info = undefined
    }
}

class PokemonSpecies {
    is_mythical: boolean
    is_legendary: boolean
    evolution_chain_url: string
    evolves_from: BasicPokemon
    growth_rate: NameURL

    constructor(body: Record<string, any>) {
        this.is_legendary = body.is_legendary
        this.is_mythical = body.is_mythical
        this.evolution_chain_url = body.evolution_chain.url
        if (body.evolves_from_species) {
            this.evolves_from = new BasicPokemon(body.evolves_from_species)
        }
        this.growth_rate = NameURL.fromObj(body.growth_rate)
        this.growth_rate.name = this.growth_rate.name.capitaliseEachWord()
    }
}

////

class Chain {
    to: Chain[]
    details: EvolutionDetails[]
    species: BasicPokemon

    constructor(body) {
        this.to = body.evolves_to.map(t => new Chain(t))
        this.details = body.evolution_details.map(d => new EvolutionDetails(d))
        this.species = new BasicPokemon(body.species)
    }
}

function flattenChain<T>(chains: Chain[], prop: (Chain) => any): T[] {
    return chains.reduce((acc, x) => {
        acc = acc.concat(prop(x))
        if (x.to) {
            acc = acc.concat(flattenChain(x.to, prop))
            x.to = []
        }
        return acc;
    }, [])
}

class EvolutionChain {

    pokemons: BasicPokemon[]

    constructor(body) {
        const evo = new Chain(body.chain)
        this.pokemons = flattenChain<BasicPokemon>(evo.to, x => x.species)
        this.pokemons.push(evo.species)
    }
}

interface PokeAndDetail {
    bPokemon: BasicPokemon
    detail: EvolutionDetails[]
}
class EvolutionDetail {
    detail: EvolutionDetails[]

    constructor(body: any, searchId: number) {
        const evo = new Chain(body.chain)
        const first: PokeAndDetail = { bPokemon: evo.species, detail: evo.details }
        const deets = flattenChain<PokeAndDetail>(evo.to, (x => {
            const pd: PokeAndDetail = { bPokemon: x.species, detail: x.details }
            return pd
        }))
        deets.push(first)
        this.detail = deets.filter(x => x.bPokemon.id == searchId)[0].detail
    }
}

class Pokemon {
    base: BasePokemon
    species: PokemonSpecies
    chain: BasicPokemon[]
    abilities: Ability[]

    constructor(base: BasePokemon, species: PokemonSpecies, chain: EvolutionChain, abilities: Ability[]) {
        this.base = base
        this.species = species
        this.chain = chain.pokemons
        this.abilities = abilities

        const clearCheck = (i: any): i is Clearable => i.clear !== undefined
        const properties = [this.base, this.species, this.chain, this.abilities]
        properties.forEach(a => {
            if (clearCheck(a)) {
                a.clear()
            }
        })

    }
}

export { BasicPokemon, Pokemon, PokemonSpecies, EvolutionChain, EvolutionDetail, BasePokemon, AbilityInfo }