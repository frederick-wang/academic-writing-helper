import path from 'path'
import fs from 'fs-extra'
import { ipcRenderer as ipc } from 'electron'
import cheerio from 'cheerio'
import async from 'async'

import Info from './Info'
import Logger from './Logger'
import { WordItem } from '@/interface'

/**
 * 处理翻译的辅助类
 *
 * @export
 * @class Translation
 */
export default class Translation {
  private static DICT_PATH = path.resolve(Info.APP_PATH, 'data/dict.json')
  private static dict: any = {}
  private static isDictImported = false

  private static ensureDictInitiated() {
    if (!Translation.isDictImported) {
      try {
        fs.ensureFileSync(Translation.DICT_PATH)
        const data = fs.readFileSync(Translation.DICT_PATH, 'utf8')
        if (data) {
          Translation.dict = Object.assign(Translation.dict, JSON.parse(data))
          Translation.isDictImported = true
        }
      } catch (err) {
        err.message = 'Error 1001: ' + err.message
        Logger.error(err)
      }
    }
  }

  public static getWordCollectionTranslation(words: string[], limit: number) {
    Translation.ensureDictInitiated()

    return new Promise<WordItem[]>((resolve, reject) => {
      async.mapLimit(
        words,
        limit,
        (word, callback) => {
          Translation.getWordTranslation(word)
            .then((data) => callback(null, data))
            .catch((err) => callback(err))
        },
        (err, results) => {
          if (err) {
            reject(err)
          }
          resolve(results as WordItem[])
        }
      )
    })
  }

  public static getWordTranslation(word: string) {
    Translation.ensureDictInitiated()

    return new Promise<WordItem>(async (resolve, reject) => {
      if (Translation.dict[word]) {
        resolve(Object.assign({ word }, Translation.dict[word]))
      } else {
        const url = `http://www.youdao.com/w/eng/${word}`
        ipc.once(`request-result-${url}`, (event: any, res: any) => {
          const $ = cheerio.load(res.body)
          const translation = $('#phrsListTab .trans-container ul')
            .text()
            .split('\n')
            .map((v) => v.trim())
            .filter((v) => v)
          const addition = $('#phrsListTab .trans-container .additional')
            .text()
            .replace(/\n|\[\s+|\s+]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
          if (translation.length || addition) {
            const result = { translation, addition }
            Translation.dict[word] = result
            resolve(Object.assign({ word }, Translation.dict[word]))
          } else {
            reject(
              new Error(
                `Error 1002: The word "${word}" doesn't have translation.`
              )
            )
          }
        })
        ipc.send('request', url)
      }
    })
  }

  public static saveWordsTranslation() {
    Translation.ensureDictInitiated()

    return new Promise((resolve, reject) => {
      try {
        fs.ensureFileSync(Translation.DICT_PATH)
        const data = fs.readFileSync(Translation.DICT_PATH, 'utf8')
        if (data) {
          Translation.dict = Object.assign(Translation.dict, JSON.parse(data))
        }
        const newData = JSON.stringify(Translation.dict)
        if (newData !== data) {
          fs.writeFileSync(Translation.DICT_PATH, newData)
        }
        resolve(Translation.dict)
      } catch (err) {
        err.message = 'Error 1003: ' + err.message
        reject(err)
      }
    })
  }
}
