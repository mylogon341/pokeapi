import "../Helpers"

export class Type {
    name: string
    url: string
    constructor(body) {
        this.name = body.type.name.capitaliseFirstLetter()
        this.url = body.type.url
    }
}