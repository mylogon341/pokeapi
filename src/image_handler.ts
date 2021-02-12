import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import axios from 'axios'

export enum ImageSource {
    poke_image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/",
    poke_sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon",
    item_sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items"
}

// const local_dir = "/mnt/storage/images"

const local_dir = "/Users/lukesadler/pokemon/images"

export async function getImage(type: ImageSource, index: string): Promise<string> {

    const url = `${type}/${index}.png`
    const name = md5(url)
    const file = `${local_dir}/${name}.png`

    if (fs.existsSync(file)) {
        return new Promise((success, _) => success(file))
    }

    const writer = fs.createWriteStream(file)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)
    return new Promise((success, reject) => {
        writer.on('finish', () => success(file))
        writer.on('error', reject)
    })
}