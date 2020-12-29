import { Move } from "./moves"
import { Stats } from "./stats"
import { capitalizeFirstLetter, versionNumberFromUrl } from "../Helpers"
import { Type } from "./types"

class BasicPokemon {
    name: string
    url: string
    index: number
    constructor(body) {

        this.name = capitalizeFirstLetter(body.name)
        this.url = body.url
        this.index = versionNumberFromUrl(body.url)
    }
}

class BasePokemon {
    id: number
    name: string
    moves: Move[]
    species_url: string
    official_artwork: string
    stats: Stats[]
    types: Type[]

    constructor(body) {
        this.id = body.id
        this.moves = body.moves.map(m => new Move(m))
        this.name = capitalizeFirstLetter(body.name)
        this.species_url = body.species.url
        this.official_artwork = body.sprites.other["official-artwork"]["front_default"]
        this.stats = body.stats.map(s => new Stats(s))
        this.types = body.types.map(t => new Type(t))
    }
}

class PokemonSpecies {
    is_mythical: boolean
    is_legendary: boolean
    evolution_chain_url: string
    evolves_from: BasicPokemon

    constructor(body) {
        this.is_legendary = body.is_legendary
        this.is_mythical = body.is_mythical
        this.evolution_chain_url = body.evolution_chain.url
        if (body.evolves_from_species) {
            this.evolves_from = new BasicPokemon(body.evolves_from_species)
        }
    }
}

////

class Chain {
    to: Chain[]
    species: BasicPokemon
    constructor(body) {
        this.to = body.evolves_to.map(t => new Chain(t))
        this.species = new BasicPokemon(body.species)
    }
}

function flattenChain(chains: Chain[]): BasicPokemon[] {
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

    pokemons: BasicPokemon[]

    constructor(body) {
        const evo = new Chain(body.chain)
        this.pokemons = flattenChain(evo.to)
        this.pokemons.push(evo.species)
    }
}

class Pokemon {
    base: BasePokemon
    species: PokemonSpecies
    chain: EvolutionChain

    constructor(base: BasePokemon, species: PokemonSpecies, chain: EvolutionChain) {
        this.base = base
        this.species = species
        this.chain = chain
    }
}

export { BasicPokemon, Pokemon, PokemonSpecies, EvolutionChain, BasePokemon }