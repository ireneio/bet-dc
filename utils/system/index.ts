import fs from 'fs'
import * as path from 'path'

export function removeDiskImages() {
  const dir = path.join(__dirname, '..', 'public')
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    for (const file of files) {
      if (file.toString() !== 'placeholder.txt') {
        fs.unlink(path.join(dir, file), err => {
          if (err) throw err
        })
      }
    }
  })
}
