import { resolve } from "path"
import { pokemon } from './requests'

export enum ImageSource {
    poke_image,
    poke_sprite,
    item_sprite
}

export async function getImage(type: ImageSource, index: string): Promise<string> {

    const poke = await pokemon(index)
    let path = ""

    switch (type) {
        case ImageSource.poke_image:
            path = poke
            .base
            .sprite
            .groups
            .filter(m => m.name == "OTHER")[0]
            .sprite_groups
            .filter(m=>m.group_name == "Official Artwork")[0]
            .sprites[0]
            .url
            .imageUrlToPath()

            break;
        case ImageSource.poke_sprite:
             path = poke.base.sprite.groups.filter(m => m.name == 'default')[0]
             .sprite_groups[0]
             .sprites.filter(m => m.name == "front default")[0]
             .url
             .imageUrlToPath()
            break;
        case ImageSource.item_sprite:
            break;
    }

    return resolve("../node_modules/pokemon-sprites" + path)
}