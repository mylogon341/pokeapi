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
            path = poke.base.official_artwork.imageUrlToPath()
            break;
        case ImageSource.poke_sprite:
            path = poke.base.sprite.imageUrlToPath()
            break;
        case ImageSource.item_sprite:
            break;
    }

    return resolve("../node_modules/pokemon-sprites" + path)
}