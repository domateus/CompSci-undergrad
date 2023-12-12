const exec = sentence => {
  console.log(sentence + ' -> ' + sentence.split(' ').map(translate).join(' '));
};

const translate = word => {
  if (isNumber(word)) return word;
  const [prefix, stem, punctuation] = splitWord(word);
  const suffix = prefix.length === 0 ? 'yay' : 'ay';

  let translatedWord = stem + prefix + suffix + punctuation;
  translatedWord = translatedWord.toLowerCase();
  if (isCapitalized(word)) {
    translatedWord = capitalize(translatedWord);
  }

  return translatedWord;
};

const isNumber = word => '0123456789'.split('').includes(word[0]);
const hasPunctuation = word => ',!'.split('').includes(word[word.length - 1]);
const isCapitalized = word =>
  'ABCDFGHIJKLMNOPQRSTUVWXYZ'.split('').includes(word[0]);
const capitalize = word => {
  return word[0].toUpperCase() + word.slice(1, word.length).toLowerCase();
};

const splitWord = word => {
  const vowels = 'aeiouy'.split('');
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      const prefix = word.slice(0, i);
      let stem = word.slice(i, word.length);
      let punctuation = '';
      if (hasPunctuation(stem)) {
        punctuation = stem[stem.length - 1];
        stem = stem.slice(0, stem.length - 1);
      }
      return [prefix, stem, punctuation];
    }
  }
  const punctuation = hasPunctuation(word) ? word[word.length - 1] : '';
  return ['', word, punctuation];
};

exec('Stop');
exec('No littering');
exec('No shirts, no shoes, no service');
exec('No persons under 14 admitted');
exec('Hey buddy, get away from my car!');
exec('I');
exec('eye');
