import StringTokenizer from './PostTextTokenizer.js';

class SearchQuery {
  textTokens;
  startDttm;
  endDttm;
  tags;
  sortBy;
  constructor(inputString) {
    this.textTokens = StringTokenizer.tokenizeByNouns(inputString);
    this.tags = [];
  }

  get getTextTokens() {
    return this.textTokens;
  }
  get getTags() {
    return this.tags;
  }
  get getSortBy() {
    return this.sortBy;
  }
  get getStartDttm() {
    return this.startDttm;
  }
  get getEndDttm() {
    return this.endDttm;
  }

  addConstraints(constraintsData) {
    const { startDttm, endDttm, sortBy, tagData } = constraintsData;
    this.startDttm = startDttm || '1970-01-01';
    this.endDttm = endDttm || '2999-12-31';
    this.sortBy = sortBy;
    if (!tagData) return;
    this.tags = [...tagData];
  }
}

export default SearchQuery;
