/* eslint-disable no-case-declarations */
import { resolve } from "path"
import { existsSync } from "fs"
import { pokemon } from './requests'

export enum ImageSource {
    poke_image,
    poke_sprite,
    item_sprite
}

export async function getImage(type: ImageSource, index: string): Promise<string> {
    const nothing = '../node_modules/pokemon-sprites/sprites/items/poke-ball.png'
    let resolvePath = ""

    switch (type) {
        case ImageSource.poke_image:
            
            const poke = await pokemon(index)
            const sprite = poke
            .base
            .sprite
            .groups
            .filter(m => m.name == "OTHER")[0]
            .sprite_groups
            .filter(m=>m.group_name == "Official Artwork")[0]
            .sprites[0]
            
            if (sprite != undefined) {
                const path = sprite.url.imageUrlToPath()
                resolvePath = "../node_modules/pokemon-sprites" + path
            }
            
        case ImageSource.poke_sprite:
            resolvePath = `../node_modules/pokemon-sprites/sprites/pokemon/${index}.png`
        case ImageSource.item_sprite:
            break;
    }

    if (resolvePath != "" && existsSync(resolvePath)) {
        return resolve(resolvePath)
    } else { 
        return resolve(nothing)
    }
}