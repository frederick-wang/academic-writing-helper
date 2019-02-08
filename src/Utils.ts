import { remote, ipcRenderer as ipc } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';
import async from 'async';
import { WordItem } from '@/interface';
import Logger from '@/utils/Logger';
const APP_PATH = remote.app.getPath('userData');

/**
 * 处理翻译的辅助对象
 */
export const Translation = (() => {
  const DICT_PATH = path.resolve(APP_PATH, 'data/dict.json');
  let dict: any = {};

  try {
    fs.ensureFileSync(DICT_PATH);
    const data = fs.readFileSync(DICT_PATH, 'utf8');
    if (data) {
      dict = Object.assign(dict, JSON.parse(data));
    }
  } catch (err) {
    err.message = 'Error 1001: ' + err.message;
    Logger.error(err);
  }

  return {
    getWordCollectionTranslation(words: string[], limit: number) {
      return new Promise<WordItem[]>((resolve, reject) => {
        async.mapLimit(
          words,
          limit,
          (word, callback) => {
            Translation.getWordTranslation(word)
              .then(data => callback(null, data))
              .catch(err => callback(err));
          },
          (err, results) => {
            if (err) {
              reject(err);
            }
            resolve(results as WordItem[]);
          });
      });
    },
    getWordTranslation(word: string) {
      return new Promise<WordItem>(async (resolve, reject) => {
        if (dict[word]) {
          resolve(Object.assign({ word }, dict[word]));
        } else {
          const url = `http://www.youdao.com/w/eng/${word}`;
          ipc.once(`request-result-${url}`, (event: any, res: any) => {
            const $ = cheerio.load(res.body);
            const translation = $('#phrsListTab .trans-container ul')
              .text()
              .split('\n')
              .map(v => v.trim())
              .filter(v => v);
            const addition = $('#phrsListTab .trans-container .additional')
              .text()
              .replace(/\n|\[\s+|\s+]/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            if (translation.length || addition) {
              const result = { translation, addition };
              dict[word] = result;
              resolve(Object.assign({ word }, dict[word]));
            } else {
              reject(new Error(`Error 1002: The word "${word}" doesn't have translation.`));
            }
          });
          ipc.send('request', url);
        }
      });
    },
    saveWordsTranslation() {
      return new Promise((resolve, reject) => {
        try {
          fs.ensureFileSync(DICT_PATH);
          const data = fs.readFileSync(DICT_PATH, 'utf8');
          if (data) {
            dict = Object.assign(dict, JSON.parse(data));
          }
          const newData = JSON.stringify(dict);
          if (newData !== data) {
            fs.writeFileSync(DICT_PATH, newData);
          }
          resolve(dict);
        } catch (err) {
          err.message = 'Error 1003: ' + err.message;
          reject(err);
        }
      });
    }
  };
})();

/**
 * 处理标点的辅助对象
 */
export const Punctuation = (() => {
  const regExpPattern = `.+?(;|(\\\.{3}|\\\.)|\\\?|!|…|$)`;
  const sentencePunctuationRegExp = new RegExp(regExpPattern);
  const sentencePunctuationRegExpG = new RegExp(regExpPattern, 'g');
  const punctuations = new Map([
    [':', true],
    [',', true],
    [';', true],
    ['"', true],
    ['`', true],
    ['~', true],
    [`'`, true],
    ['-', true],
    ['--', true],
    ['\\', true],
    ['/', true],
    ['<', true],
    ['>', true],
    ['{', true],
    ['}', true],
    ['[', true],
    [']', true],
    ['+', true],
    ['-', true],
    ['*', true],
    ['_', true],
    ['(', true],
    [')', true],
    ['&', true],
    ['^', true],
    ['%', true],
    ['$', true],
    ['#', true],
    ['@', true],
    ['.', true],
    ['?', true],
    ['!', true],
    ['|', true],
    ['...', true],
    ['…', true]
  ]);

  return {
    sentencePunctuationRegExp,
    sentencePunctuationRegExpG,
    is: (v: string) => punctuations.has(v),
    /**
     * 将文本中的中文标点转化为英文标点
     */
    normalizeText: (text: string) =>
      text.replace(/“|”/g, '"')
        .replace(/‘|’/g, `'`)
        .replace(/，/g, ',')
        .replace(/。/g, '.')
        .replace(/！/g, '!')
        .replace(/？/g, '?')
        .replace(/；/g, ';')
        .replace(/：/g, ':')
        .replace(/【/g, '[')
        .replace(/】/g, ']')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
    // 看起来好看点，虽然这两个实际上不是一个符号
    // .replace(/’/g, '\'')
  };
})();

/**
 * 处理文本的辅助对象
 */
export const Text = (() => {
  const regExpPattern =
    // tslint:disable-next-line max-line-length
    `(\\s+|:|,|"|~|\`|(?:--|-)|\\\\|\\\/|<|>|\\\{|\\\}|\\\[|\\\]|\\\+|\\\*|_|\\\(|\\\)|&|\\\^|%|\\\$|#|@|\\\||’|;|(?:\\\.{3}|\\\.)|\\\?|!|…)`;
  const separatorRegExp = new RegExp(regExpPattern);
  const separatorRegExpG = new RegExp(regExpPattern, 'g');

  return {
    separatorRegExp, separatorRegExpG,
    isSeparator: (word: string) => !!word.match(separatorRegExp),
    tidyCRLF: (str: string) =>
      str
        .replace(/\r/g, '\n')
        .replace(/\n\s+\n/g, '\n\n')
        .replace(/\n{2,}/g, '\n')
        .replace(/^\n/, ''),
    split: (str: string, separator: string | RegExp) =>
      str
        .trim()
        .split(separator)
        .map(v => v.trim())
        .filter(v => v)
  };
})();

export default { Punctuation, Translation, Text };
