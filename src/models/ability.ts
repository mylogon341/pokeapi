import { capitalizeFirstLetter, lineBreaksToString } from "../Helpers"

export class Ability {
    flavour_text: string
    description: string
    name: string
    id: number
    is_hidden: boolean

    constructor(data, isHidden: boolean) {
        this.is_hidden = isHidden
        this.id = data.id
        this.name = capitalizeFirstLetter(data.name)

        const flavours = data.flavor_text_entries.filter(f => f.language.name == "en")
        if (flavours.length > 0) {
            const flavourText: string = flavours[0].flavor_text
            this.flavour_text = lineBreaksToString(flavourText)
        }

        const entries = data.effect_entries.filter(i => i.language.name === "en")
        if (entries.length > 0) {
            this.description = entries[0].effect
        }
    }
}