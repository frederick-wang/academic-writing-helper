
const isDevelopment = process.env.NODE_ENV !== 'production';

export const Logger = {
  log(...values: any[]) {
    if (isDevelopment) {
      console.log(...values);
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
  isCET4: (word: string) => cet4.has(word),
  isCET6: (word: string) => cet6.has(word),
  isToefl: (word: string) => toefl.has(word),
  isGRE: (word: string) => gre.has(word),
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
  getWordScore: (word: string) => {
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
  getWordBackgroundColor: (word: string) => {
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
