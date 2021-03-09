
class SpriteGroup {
    group_name: string
    sprites: SpriteItem[]
    constructor(name: string) {
        this.group_name = name
        this.sprites = []
    }
}

class SpriteItem {
    url: string
    name: string
    constructor(url: string, name: string) {
        this.url = url
        this.name = name
    }
}

export class Sprites {

    groups: SpriteGroup[]

    constructor(body: Record<string, any>) {
        this.groups = []
        this.groups.push(new SpriteGroup("Default"))

        const sprites = body.sprites
        this.addImage("Official artwork", sprites.other["official-artwork"]["front_default"])
        this.addImage("Back default", sprites["back_default"])
        this.addImage("Back female", sprites["back_default_female"])
        this.addImage("Back shiny", sprites["back_shiny"])
        this.addImage("Back shiny female", sprites["back_shiny_female"])
        this.addImage("Front default", sprites["front_default"])
        this.addImage("Front female", sprites["front_female"])
        this.addImage("Front shiny", sprites["front_shiny"])
        this.addImage("Front shiny female", sprites["front_shiny_female"])
    }

    addImage(name: string, url: string): void {
        const last = this.groups[this.groups.length - 1]
        if (url != null && url != undefined) {
            last.sprites.push(new SpriteItem(url, name))
        }
    }
}