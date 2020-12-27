export class Type {
    name: string
    url: string
    constructor(body) {
        this.name = body.type.name
        this.url = body.type.url
    }
}