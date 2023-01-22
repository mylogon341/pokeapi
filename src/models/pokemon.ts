import { Stats } from "./stats"
import "../Helpers"
import { Type } from "./types"
import { Ability } from "./ability"
import { EvolutionDetails } from "./evolutionDetails"
import { BasicMove } from "./move"
import { NameURL } from "./common"
import { Sprites } from "./sprites"

class Clearable {
    clear(): void { console.log("empty implementation") }
}

class BasicPokemon {
    name: string
    id: number
    constructor(body: Record<string, string>) {

        this.name = body.name.removeDashes().capitaliseEachWord()
        this.id = body.url.versionNumberFromUrl()
    }
}

type AbilityInfo = { id: number, hidden: boolean }

class BasePokemon extends Clearable {
    id: number
    name: string
    moves: BasicMove[]
    species_url: string | null
    sprite: Sprites
    stats: Stats[]
    types: string[]
    ability_info: AbilityInfo[]

    constructor(body: Record<string, any>) {
        super()
        this.id = body.id
        this.moves = body.moves.map(m => new BasicMove(m))
        this.name = body.name.removeDashes().capitaliseEachWord()
        this.species_url = body.species.url
        this.sprite = new Sprites(body)
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
    evolution_chain_url?: string
    evolves_from: BasicPokemon
    growth_rate?: NameURL
    dex_entry: string
    jap_name: string
    roomaji_name?: string

    constructor(body: Record<string, any>) {
        this.is_legendary = body.is_legendary
        this.is_mythical = body.is_mythical

        if (body.evolution_chain != null) {
            this.evolution_chain_url = body.evolution_chain.url
        } else {
            this.evolution_chain_url = null
        }
        
        if (body.evolves_from_species) {
            this.evolves_from = new BasicPokemon(body.evolves_from_species)
        }
        
        if (body.growth_rate != null) {
            this.growth_rate = NameURL.fromObj(body.growth_rate)
            this.growth_rate.name = this.growth_rate.name.capitaliseEachWord()
        } else {
            this.growth_rate = null
        }

        const descriptions: Record<string, any>[] = body.flavor_text_entries

        if (descriptions.length > 0) {

            const english = descriptions
            .filter(i => i.language.name === "en")
            .sort((a, b) => {
                return a.version.url.versionNumberFromUrl() - b.version.url.versionNumberFromUrl()
            })[0]
            
            this.dex_entry = english.flavor_text.removeLinebreaks()
        } else {
            this.dex_entry = "No pokédex entry provided yet"
        }
        
        this.jap_name = body.names.find(v => v.language.name == "ja").name
        this.roomaji_name = body.names.find(v => v.language.name == "roomaji")?.name
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

class EvolutionChain extends Clearable {

    pokemons: BasicPokemon[]

    constructor(body) {
        super()
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
    detail: EvolutionDetails[] | undefined

    constructor(body: any, searchId: number) {
        const evo = new Chain(body.chain)
        const first: PokeAndDetail = { bPokemon: evo.species, detail: evo.details }
        const deets = flattenChain<PokeAndDetail>(evo.to, (x => {
            const pd: PokeAndDetail = { bPokemon: x.species, detail: x.details }
            return pd
        }))
        deets.push(first)

        const deet = deets.find(x => x.bPokemon.id == searchId)
        if (deet != undefined) {
            this.detail = deet.detail
        }
    }
}

class Pokemon {
    base: BasePokemon
    species: PokemonSpecies
    chain?: BasicPokemon[]
    abilities: Ability[]

    constructor(base: BasePokemon, species: PokemonSpecies, abilities: Ability[], chain?: EvolutionChain) {
        this.base = base
        this.species = species
        this.chain = chain?.pokemons
        this.abilities = abilities

        const clearCheck = (i: any): i is Clearable => i.clear !== undefined
        const properties = [this.base, this.species, this.chain, this.abilities]
        properties.forEach(a => {
            if (a != undefined && clearCheck(a)) {
                a.clear()
            }
        })

    }
}

export { BasicPokemon, Pokemon, PokemonSpecies, EvolutionChain, EvolutionDetail, BasePokemon, AbilityInfo }