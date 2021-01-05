import { capitalizeFirstLetter } from "../Helpers"

export class NameURL {
    name: string
    url: string
    constructor(name: string, url: string) {
        this.name = capitalizeFirstLetter(name)
        this.url = url
    }

    static fromObj(obj: Record<string, string>): NameURL | undefined {
        return obj ? new NameURL(obj.name, obj.url) : undefined
    }
}