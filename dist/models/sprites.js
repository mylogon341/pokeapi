"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprites = void 0;
// generation-i etc
class GenerationGroup {
    constructor(name) {
        this.name = name;
        this.sprite_groups = [];
    }
}
// red-blue etc
class SpriteGroup {
    constructor(name) {
        this.group_name = name;
        this.sprites = [];
    }
}
// front-default etc
class SpriteItem {
    constructor(url, name) {
        this.url = url;
        this.name = name;
    }
}
class Sprites {
    constructor(body) {
        this.groups = [];
        const sprites = body.sprites;
        this.groups.push(new GenerationGroup("default"));
        this.groups[0].sprite_groups.push(new SpriteGroup("default"));
        this.getPairs("Default", sprites);
    }
    getPairs(name, obj) {
        if (name.includes("generation") || name.includes("other")) {
            this.groups.push(new GenerationGroup(name.removeDashes().toUpperCase()));
            Object.keys(obj).forEach(name => {
                this.groups[this.groups.length - 1]
                    .sprite_groups.push(new SpriteGroup(name.removeDashes().capitaliseEachWord()));
                this.getPairs(name, obj[name]);
            });
            return;
        }
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (typeof (value) == 'string') {
                this.addImage(key, value);
            }
            else if (typeof (value) == 'object' &&
                value != null) {
                this.getPairs(key, value);
            }
        });
    }
    addImage(name, url) {
        const last = this.groups[this.groups.length - 1];
        const lastGenGroup = last.sprite_groups;
        const lastSpriteGroup = lastGenGroup[lastGenGroup.length - 1];
        if (url != null && url != undefined) {
            lastSpriteGroup
                .sprites
                .push(new SpriteItem(url, name.camelToPresentation()));
        }
    }
}
exports.Sprites = Sprites;
//# sourceMappingURL=sprites.js.map