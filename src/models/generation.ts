import { NameURL } from "./common";
import { BasicPokemon } from "./pokemon";

export class AllGenerations {
    generations: NameURL[]

    constructor(response) {
        this.generations = response
            .data
            .results
            .map(g => NameURL.fromObj(g))
    }
}

export class Generation {
    region_name: string
    gen_name: string
    pokemon: BasicPokemon[]
    version_groups: NameURL[]

    constructor(data) {
        this.region_name = data.main_region.name.capitaliseFirstLetter()
        this.gen_name = data.name
        this.pokemon = data.pokemon_species.map(p => new BasicPokemon(p))
        this.version_groups = data.version_groups.map(v => NameURL.fromObj(v))
    }
}