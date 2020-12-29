import { capitalizeFirstLetter, versionNumberFromUrl } from "../Helpers"

class GameVar {
    move_name: string
    version_name: string
    version_url: string
    version_number: number
    level_learned_at: number
    learned_via: string

    constructor(moveName, data) {
        this.version_name = capitalizeFirstLetter(data["version_group"].name)
        this.version_url = data["version_group"].url
        this.version_number = versionNumberFromUrl(this.version_url)
        this.level_learned_at = Number(data["level_learned_at"])
        this.learned_via = data["move_learn_method"].name
        this.move_name = moveName
    }
}

export class Move {
    name: string
    game_variants: GameVar[]

    constructor(data) {
        this.name = capitalizeFirstLetter(data.move.name)
        const groupDetails: { string: any }[] = data["version_group_details"]
        this.game_variants = groupDetails.map(g => new GameVar(this.name, g))
    }
}