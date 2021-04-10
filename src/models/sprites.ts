// generation-i etc
class GenerationGroup {
    name: string
    sprite_groups: SpriteGroup[]

    constructor(name: string) {
        this.name = name
        this.sprite_groups = []
    }
}

// red-blue etc
class SpriteGroup {
    group_name: string
    sprites: SpriteItem[]
    constructor(name: string) {
        this.group_name = name
        this.sprites = []
    }
}

// front-default etc
class SpriteItem {
    url: string
    name: string
    constructor(url: string, name: string) {
        this.url = url
        this.name = name
    }
}

export class Sprites {

    groups: GenerationGroup[]

    constructor(body: Record<string, any>) {
        this.groups = []
        const sprites = body.sprites

        this.groups.push(new GenerationGroup("default"))
        this.groups[0].sprite_groups.push(new SpriteGroup("default"))

        this.getPairs("Default", sprites)
    }

    getPairs(name: string, obj: any): void {

        if (name.includes("generation") || name.includes("other")) {
            this.groups.push(new GenerationGroup(name.removeDashes().toUpperCase()))

            Object.keys(obj).forEach(name => {
                this.groups[this.groups.length - 1]
                    .sprite_groups.push(new SpriteGroup(name.removeDashes().capitaliseEachWord()))

                this.getPairs(name, obj[name])
            })
            return
        }

        Object.keys(obj).forEach(key => {
            const value = obj[key]

            if (typeof (value) == 'string') {
                this.addImage(key, value)
            } else if (typeof (value) == 'object' &&
                value != null) {
                this.getPairs(key, value)
            }
        })
    }

    addImage(name: string, url: string): void {
        const last = this.groups[this.groups.length - 1]
        const lastGenGroup = last.sprite_groups
        const lastSpriteGroup = lastGenGroup[lastGenGroup.length - 1]
        if (url != null && url != undefined) {

            lastSpriteGroup
                .sprites
                .push(new SpriteItem(url, name.camelToPresentation()))
        }
    }
}