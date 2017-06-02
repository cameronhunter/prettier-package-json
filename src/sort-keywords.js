module.exports = function sortKeywords(keywords = []) {
  return keywords.length === 0 ? {} : { keywords: keywords.sort() };
};
