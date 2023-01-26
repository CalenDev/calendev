import mecab from 'mecab-ya';

export default {
  tokenizeByNouns: (inputString) => {
    const resArr = [];
    const tokenizedNouns = mecab.nounsSync(inputString, (err, result) => {});
    return tokenizedNouns;
  },
};
