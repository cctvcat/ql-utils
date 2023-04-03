import path from 'path'
import fs from 'fs'

export type StorageOpts = {
  name?: string
  dir?: string
}

const DATA = Symbol('DATA')
const SAVE_PATH = Symbol('SAVE_PATH')

export class Storage {
  private [DATA]: Record<string, string> = {}
  private [SAVE_PATH]: string

  constructor(opts: StorageOpts = {}) {
    const {
      name = 'localStorage',
      dir = path.resolve(path.resolve(), 'data'),
    } = opts
    this[SAVE_PATH] = path.resolve(dir, `${name}.json`)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    } else if (fs.existsSync(this[SAVE_PATH])) {
      this[DATA] = this.getData()
    }
  }

  private getData() {
    try {
      return JSON.parse(fs.readFileSync(this[SAVE_PATH]).toString('utf8'))
    } catch (e) {
      return {}
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this[SAVE_PATH], JSON.stringify(this[DATA]))
    } catch (e) {
      console.log(e)
    }
  }

  setItem(key: string, val: string, save = true) {
    this[DATA][key] = val
    if (save) {
      this.saveData()
    }
  }

  getItem(key: string, defaultVal: string) {
    return this[DATA][key] !== undefined ? this[DATA][key] : defaultVal
  }
}

export const storage = Storage

export const loaclStorage = (() => {
  let storage: Storage

  return {
    setItem(key: string, val: string) {
      if (!!storage) {
        storage = new Storage()
      }
      storage.setItem(key, val)
    },
    getItem(key: string, defaultVal: string) {
      if (!!storage) {
        storage = new Storage()
      }
      storage.getItem(key, defaultVal)
    },
  }
})()
