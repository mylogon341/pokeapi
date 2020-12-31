import { capitalizeFirstLetter, versionNumberFromUrl } from "../Helpers"

export class Ability {
    description: string
    generation: number
    name: string
    id: number
    is_hidden: boolean

    constructor(data, isHidden: boolean) {
        this.is_hidden = isHidden
        this.id = data.id
        this.name = capitalizeFirstLetter(data.name)
        this.generation = versionNumberFromUrl(data.generation.url)
        console.log(this.name)
        const entries = data.effect_entries.filter(i => i.language.name === "en")
        if (entries.length > 0) {
            this.description = entries[0].effect
        }
    }
}