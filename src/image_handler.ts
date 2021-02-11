// import fs from 'fs'
import path from 'path'
import md5 from 'md5'

const local_dir = "/mnt/storage/images"

export async function getImage(url: string): Promise<string> {
    const name = md5(url)
    const file = path.join(local_dir, name)

    return new Promise((success, reject) => {
        success(file)
        // if (fs.readFile)

    })
}