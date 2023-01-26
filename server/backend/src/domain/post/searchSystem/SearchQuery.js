import StringTokenizer from './PostTextTokenizer.js';

class SearchQuery {
  textTokens;
  startDttm;
  endDttm;
  tags;
  sortBy;
  page;
  limit;
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
  get getPage() {
    return this.page;
  }
  get getLimit() {
    return this.limit;
  }

  addConstraints(constraintsData) {
    const { startDttm, endDttm, sortBy, tags, page, limit } = constraintsData;
    this.startDttm = startDttm || '1970-01-01';
    this.endDttm = endDttm || '2999-12-31';
    this.sortBy = sortBy;
    this.page = page === undefined ? 1 : page;
    this.limit = limit;
    if (!tags) return;
    this.tags = [...tags];
  }
}

export default SearchQuery;
