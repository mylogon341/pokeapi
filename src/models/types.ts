import { capitalizeFirstLetter } from "../Helpers"

export class Type {
    name: string
    url: string
    constructor(body) {
        this.name = capitalizeFirstLetter(body.type.name)
        this.url = body.type.url
    }
}