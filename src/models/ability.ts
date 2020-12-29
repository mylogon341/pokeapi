import { capitalizeFirstLetter, versionNumberFromUrl } from "../Helpers"

export class Ability {
    description: string
    generation: number
    name: string
    isHidden: boolean

    constructor(data, isHidden: boolean) {
        this.isHidden = isHidden
        this.name = capitalizeFirstLetter(data.name)
        this.generation = versionNumberFromUrl(data.generation.url)
        console.log(this.name)
        const entries = data.effect_entries.filter(i => i.language.name === "en")
        if (entries.length > 0) {
            this.description = entries[0].effect
        }
    }
}