export interface SentenceItem {
  score: number;
  sentence: string[];
}

export interface WordItem {
  word: string;
  translation: string[];
  addition: string;
}

export interface SentenceItemWithRelevance extends SentenceItem {
  revlevance: {
    before: string[];
    after: string[];
  };
}
