import { capitalizeFirstLetter } from "../Helpers"

export class Stats {
    name: string
    value: number
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(data) {
        this.name = capitalizeFirstLetter(data.stat.name)
        this.value = data.base_stat
    }
}