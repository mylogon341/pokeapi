/* eslint-disable no-case-declarations */
import { resolve } from "path"
import { pokemon } from './requests'

export enum ImageSource {
    poke_image,
    poke_sprite,
    item_sprite
}

export async function getImage(type: ImageSource, index: string): Promise<string> {
    
    switch (type) {
        case ImageSource.poke_image:
            
            const poke = await pokemon(index)
            const path = poke
            .base
            .sprite
            .groups
            .filter(m => m.name == "OTHER")[0]
            .sprite_groups
            .filter(m=>m.group_name == "Official Artwork")[0]
            .sprites[0]
            .url
            .imageUrlToPath()

            return resolve("../node_modules/pokemon-sprites" + path)
        case ImageSource.poke_sprite:
            return resolve(`../node_modules/pokemon-sprites/sprites/pokemon/${index}.png`)
        case ImageSource.item_sprite:
            break;
    }

}