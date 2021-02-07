import "../Helpers"

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

export class Move {

    game_variants: GameVar[]

    constructor(data) {
        const id = data.move.url.versionNumberFromUrl()
        const name = data.move.name

        const groupDetails: { string: any }[] = data["version_group_details"]
        this.game_variants = groupDetails.map(g => new GameVar(id, name, g))
    }
}