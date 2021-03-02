import { NameURL } from "./common";
import { BasicPokemon, Pokemon } from "./pokemon";

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
    id: number
    region_name: string
    gen_name: string
    pokemon: BasicPokemon[]
    version_groups: NameURL[]

    constructor(data) {
        this.id = data.id
        this.region_name = data.main_region.name.capitaliseFirstLetter()
        this.gen_name = data.name
        this.pokemon = data.pokemon_species.map(p => new BasicPokemon(p))
        this.version_groups = data.version_groups.map(v => NameURL.fromObj(v))
    }

    static create_from(
        id: number,
        region_name: string,
        gen_name: string,
        pokemon: any,
        version_names: string[]): Generation {

        return new Generation(
            {
                "id": id,
                "main_region": { "name": region_name},
                "name": gen_name,
                "pokemon_species": pokemon,
                "version_groups": version_names.map(n => {
                    return {
                        "name": n,
                        "url": "blah/1/"
                    }
                })
            }
        )
    }
}