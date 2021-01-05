import { dashStringToSentence, lineBreaksToString, versionNumberFromUrl } from "../Helpers"
import { NameURL } from "./common"
import { BasicPokemon } from "./pokemon"

export class BasicItem {
    name: string
    id: number
    sprite_name: string
    constructor(i: Record<string, string>) {
        this.name = dashStringToSentence(i.name)
        this.id = versionNumberFromUrl(i.url)
        this.sprite_name = i.name
    }
}

interface EffectDescription {
    short: string
    full: string
}

interface FlavourTextEntry {
    group: string
    entry: string
}

export class Item {
    id: number
    name: string
    cost: number
    attributes: NameURL[]
    baby_trigger_for: string | undefined
    fling_power: number | undefined
    fling_effect: NameURL | undefined
    category: NameURL
    effect_description: EffectDescription
    flavour_text_entries: FlavourTextEntry[]
    sprite: string
    held_by_pokemon: BasicPokemon[]

    constructor(body: Record<string, any>) {
        this.id = body.id
        this.name = dashStringToSentence(body.name)
        this.cost = body.cost
        this.attributes = body.attributes.map(a => NameURL.fromObj(a))
        this.baby_trigger_for = body.baby_trigger_for ? body.baby_trigger_for.url : undefined
        this.fling_power = body.fling_power
        this.fling_effect = NameURL.fromObj(body.fling_effect)
        this.category = NameURL.fromObj(body.category)
        this.sprite = body.sprites.default

        const engEffectEntry = body
            .effect_entries
            .filter(e => e.language.name == "en")

        if (engEffectEntry.length > 0) {
            const entry = engEffectEntry[0]
            this.effect_description = { short: entry.short_effect, full: lineBreaksToString(entry.effect) }
        }

        this.flavour_text_entries = body
            .flavor_text_entries
            .filter(e => e.language.name == "en")
            .map(e => {
                return { group: dashStringToSentence(e.version_group.name), entry: lineBreaksToString(e.text) }
            })

        this.held_by_pokemon = body
            .held_by_pokemon
            .map(d => new BasicPokemon(d.pokemon))

    }
}