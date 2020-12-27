class GameVar {
    version_name: string
    level_learned_at: number
    learned_via: string

    constructor(data: { string: any }) {
        this.version_name = data["version_group"].name
        this.level_learned_at = Number(data["level_learned_at"])
        this.learned_via = data["move_learn_method"].name
    }
}

export class Move {
    name: string
    game_variants: GameVar[]

    constructor(data) {
        this.name = data.move.name

        const groupDetails: { string: any }[] = data["version_group_details"]
        this.game_variants = groupDetails.map(g => new GameVar(g))
    }
}