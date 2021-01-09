import "../Helpers"

export class Stats {
    name: string
    value: number
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(data) {
        this.name = data.stat.name.capitaliseFirstLetter()
        this.value = data.base_stat
    }
}