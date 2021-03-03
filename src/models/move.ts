import { NameURL } from "./common"

class GameVar {
    id: number
    move_name: string
    version_name: string
    version_number: number
    level_learned_at: number
    learned_via: string

    constructor(id: number, moveName: string, data) {

        this.id = id
        this.version_name = data["version_group"]
            .name
            .removeDashes()
            .capitaliseEachWord()

        this.version_number = data["version_group"].url.versionNumberFromUrl()

        this.level_learned_at = Number(data["level_learned_at"])
        this.learned_via = data["move_learn_method"].name

        this.move_name = moveName.removeDashes().capitaliseFirstLetter()
    }
}

export class BasicMove {

    game_variants: GameVar[]

    constructor(data) {
        const id = data.move.url.versionNumberFromUrl()
        const name = data.move.name

        const groupDetails: { string: any }[] = data["version_group_details"]
        this.game_variants = groupDetails.map(g => new GameVar(id, name, g))
    }
}

export class Move {

    name: string
    description: string
    type: string
    damage_class: string
    pp: number
    power: number
    ailment: string
    ailment_chance: number
    crit_rate: number
    drain: number
    healing: number
    max_hits: number
    max_turns: number
    min_hits: number
    min_turns: number
    stat_chance: number
    target: string

    constructor(data) {
        this.name = data.name.removeDashes().capitaliseEachWord()
        this.description = data.effect_entries
            .find(e => NameURL.fromObj(e.language).name == "En")
            .effect
        this.type = NameURL.fromObj(data.type).name
        this.damage_class = NameURL.fromObj(data.damage_class).name
        this.power = data.power
        this.pp = data.pp
        this.target = NameURL.fromObj(data.target).name

        const meta = data.meta
        this.ailment = NameURL.fromObj(meta.ailment).name
        this.ailment_chance = meta.ailment_chance
        this.crit_rate = meta.crit_rate
        this.drain = meta.drain
        this.healing = meta.healing
        this.max_hits = meta.max_hits
        this.max_turns = meta.max_turns
        this.min_hits = meta.min_hits
        this.min_turns = meta.min_turns
        this.stat_chance = meta.stat_chance
    }

    private possiblyAdd(to: Record<string, string | number>[], key: string, val: string | number) {
        if (val != undefined && val != null && val != 0 && val != "None") {
            to.push({ "order": to.length, "name": key, "value": val })
        }
    }

    flattenedData(): Record<string, string>[] {
        const data = []

        this.possiblyAdd(data, "Name", this.name)
        this.possiblyAdd(data, "Description", this.description)
        this.possiblyAdd(data, "Type", this.type)
        this.possiblyAdd(data, "Damage class", this.damage_class)
        this.possiblyAdd(data, "Power", this.power)
        this.possiblyAdd(data, "PP", this.pp)
        this.possiblyAdd(data, "Target", this.target)
        this.possiblyAdd(data, "Ailment", this.ailment)
        this.possiblyAdd(data, "Ailment chance", this.ailment_chance)
        this.possiblyAdd(data, "Crit rate", this.crit_rate)
        this.possiblyAdd(data, "Drain", this.drain)
        this.possiblyAdd(data, "Healing", this.healing)
        this.possiblyAdd(data, "Max hits", this.max_hits)
        this.possiblyAdd(data, "Min hits", this.min_hits)
        this.possiblyAdd(data, "Max turns", this.max_turns)
        this.possiblyAdd(data, "Min turns", this.min_turns)
        this.possiblyAdd(data, "Stat chance", this.stat_chance)
        return data
    }
}