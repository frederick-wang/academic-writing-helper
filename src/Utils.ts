import { remote, ipcRenderer as ipc } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';

const isDevelopment = process.env.NODE_ENV !== 'production';
const APP_PATH = remote.app.getAppPath();

/**
 * 处理调试输出的辅助对象
 */
export const Logger = {
  log(...values: any[]) {
    if (isDevelopment) {
      console.log(...values);
    }
  },
  error(...values: any[]) {
    if (isDevelopment) {
      console.error(...values);
    }
  },
  time(...values: any[]) {
    if (isDevelopment) {
      console.time(...values);
    }
  }, timeEnd(...values: any[]) {
    if (isDevelopment) {
      console.timeEnd(...values);
    }
  }
};

/**
 * 处理分级词汇表的辅助对象
 */
export const Dict = (() => {
  const importWordsData = (data: string[]): Map<string, boolean> => {
    if (junior) {
      return new Map(
        data
          .filter(v => !junior.has(v))
          .map((v: string): [string, boolean] => [v, true])
      );
    }
    return new Map(data.map((v: string): [string, boolean] => [v, true]));
  };

  let junior: any;
  junior = importWordsData(require('@/assets/dict/junior.json'));
  const cet4 = importWordsData(require('@/assets/dict/cet4.json'));
  const cet6 = importWordsData(require('@/assets/dict/cet6.json'));
  const toefl = importWordsData(require('@/assets/dict/toefl.json'));
  const gre = importWordsData(require('@/assets/dict/gre.json'));

  return {
    isCET4: (word: string) => cet4.has(word.toLowerCase()),
    isCET6: (word: string) => cet6.has(word.toLowerCase()),
    isToefl: (word: string) => toefl.has(word.toLowerCase()),
    isGRE: (word: string) => gre.has(word.toLowerCase()),
    wordBorderColor: {
      cet4: '#DCDFE6',
      cet6: '#E6A23C',
      toefl: '#67C23A',
      gre: '#409EFF'
    },
    wordBackgroundColor: {
      none: 'transparent',
      cet4: '#DCDFE680',
      cet6: '#E6A23C80',
      toefl: '#67C23A80',
      gre: '#409EFF80'
    },
    getWordScore(word: string) {
      if (Dict.isCET4(word)) {
        return 1;
      }
      if (Dict.isCET6(word)) {
        return 9;
      }
      if (Dict.isToefl(word)) {
        return 25;
      }
      if (Dict.isGRE(word)) {
        return 49;
      }
      return 0;
    },
    getWordBackgroundColor(word: string) {
      word = word.toLowerCase();
      if (Dict.isCET4(word)) {
        return Dict.wordBackgroundColor.cet4;
      }
      if (Dict.isCET6(word)) {
        return Dict.wordBackgroundColor.cet6;
      }
      if (Dict.isToefl(word)) {
        return Dict.wordBackgroundColor.toefl;
      }
      if (Dict.isGRE(word)) {
        return Dict.wordBackgroundColor.gre;
      }
      return Dict.wordBackgroundColor.none;
    }
  };
})();

/**
 * 处理翻译的辅助对象
 */
export const Translation = (() => {
  // const DATA_PATH = path.resolve(APP_PATH, 'data');
  /**
   * 2019-1-11 08:00:16
   * FIXME: It seems that dict.json cannot be created in build version.
   */
  const DICT_PATH = path.resolve(APP_PATH, 'data/dict.json');
  let dict: any = {};

  (async () => {
    try {
      await fs.ensureFile(DICT_PATH);
      const data = await fs.readFile(DICT_PATH, 'utf8');
      if (data) {
        dict = Object.assign(dict, JSON.parse(data));
      }
    } catch (err) {
      Logger.error(err);
    }
  })();
  return {
    getWordTranslation(word: string) {
      /**
       * 2019-1-11 22:47:13
       * TODO: Need to limit concurrency.
       */
      return new Promise(async (resolve, reject) => {
        if (dict[word]) {
          // Logger.log('Cached:', word);
          resolve(dict[word]);
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
              resolve(result);
            } else {
              reject(new Error(`Error 1001: The word "${word}" doesn't have translation.`));
            }
          });
          ipc.send('request', url);
        }
      });
    },
    saveWordsTranslation() {
      return new Promise((resolve, reject) => {
        fs.ensureFile(DICT_PATH)
          .then(() => {
            return fs.readFile(DICT_PATH, 'utf8');
          })
          .then(data => {
            if (data) {
              dict = Object.assign(dict, JSON.parse(data));
            }
            return fs.writeJson(DICT_PATH, dict);
          })
          .then(() => {
            resolve(dict);
          })
          .catch(err => {
            err.message = 'Error 1002: ' + err.message;
            reject(err);
          });
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

export default { Logger, Dict, Punctuation, Translation, Text };
