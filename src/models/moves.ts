import "../Helpers"

class GameVar {
    move_name: string
    version_name: string
    version_number: number
    level_learned_at: number
    learned_via: string

    constructor(moveName: string, data) {

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

export class Move {
    name: string
    game_variants: GameVar[]

    constructor(data) {
        this.name = data.move.name

        const groupDetails: { string: any }[] = data["version_group_details"]
        this.game_variants = groupDetails.map(g => new GameVar(this.name, g))

        this.name = undefined
    }
}