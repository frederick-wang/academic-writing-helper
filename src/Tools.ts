
const isDevelopment = process.env.NODE_ENV !== 'production';

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

// Punctuation
const sentencePunctuationRegExp = /.+?(;|\.|\?|!|…|\.{3}|$)/;
const wordPunctuationRegExp = /(:|,|"|'|~|`|-|\\|\/|<|>|\{|\}|\[|\]|\+|-|\*|_|\(|\)|&|\^|%|\$|#|@|\||’|…)/g;
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
  ['â€¦', true]
]);

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

export const Dict = {
  isCET4: (word: string) => cet4.has(word),
  isCET6: (word: string) => cet6.has(word),
  isToefl: (word: string) => toefl.has(word),
  isGRE: (word: string) => gre.has(word)
};

export const Punctuation = {
  sentencePunctuationRegExp, wordPunctuationRegExp,
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
