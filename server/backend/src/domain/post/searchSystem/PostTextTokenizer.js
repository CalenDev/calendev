import mecab from 'mecab-ya';

const excludeCharSet = /[\s#$%^&*()":;_]/;
export default {
  tokenizeByRegex: (inputString) => {
    const tokens = inputString
      .split(excludeCharSet)
      .filter((elem) => elem.length > 0);
    return tokens;
  },
  tokenizeByNouns: (inputString) => {
    const resArr = [];
    const tokenizedNouns = mecab.nounsSync(inputString, (err, result) => {});
    return tokenizedNouns;
  },
};
