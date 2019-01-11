import { remote, ipcRenderer as ipc } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import cheerio from 'cheerio';

const isDevelopment = process.env.NODE_ENV !== 'production';
const APP_PATH = remote.app.getAppPath();

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

// Dict
let junior: any;
junior = importWordsData(require('@/assets/dict/junior.json'));
const cet4 = importWordsData(require('@/assets/dict/cet4.json'));
const cet6 = importWordsData(require('@/assets/dict/cet6.json'));
const toefl = importWordsData(require('@/assets/dict/toefl.json'));
const gre = importWordsData(require('@/assets/dict/gre.json'));

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
      // Logger.log(dict);
    }
  } catch (err) {
    Logger.error(err);
  }
})();

function importWordsData(data: string[]): Map<string, boolean> {
  if (junior) {
    return new Map(
      data
        .filter(v => !junior.has(v))
        .map((v: string): [string, boolean] => [v, true])
    );
  }
  return new Map(data.map((v: string): [string, boolean] => [v, true]));
}

export const Dict = {
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
  getWordTranslation(word: string) {
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

// Punctuation
const sentencePunctuationRegExp = /.+?(;|(\.{3}|\.)|\?|!|…|$)/;
const sentencePunctuationRegExpG = /.+?(;|(\.{3}|\.)|\?|!|…|$)/g;
const wordPunctuationRegExp =
  /(\s+|:|,|"|'|~|`|(?:--|-)|\\|\/|<|>|\{|\}|\[|\]|\+|\*|_|\(|\)|&|\^|%|\$|#|@|\||’|;|(?:\.{3}|\.)|\?|!|…)/;
const wordPunctuationRegExpG =
  /(\s+|:|,|"|'|~|`|(?:--|-)|\\|\/|<|>|\{|\}|\[|\]|\+|\*|_|\(|\)|&|\^|%|\$|#|@|\||’|;|(?:\.{3}|\.)|\?|!|…)/g;
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

export const Punctuation = {
  sentencePunctuationRegExp,
  sentencePunctuationRegExpG,
  wordPunctuationRegExp,
  wordPunctuationRegExpG,
  /**
   * 判断是否为标点
   * TODO: Reform the judging process.
   * "word.match(Punctuation.wordPunctuationRegExp)" and Punctuation.is() are used meanwhile now.
   * Due to some issues left over by history, each of two ways returns different values.
   */
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

export default { Logger, Dict, Punctuation };
