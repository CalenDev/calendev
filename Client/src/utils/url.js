/* eslint-disable no-param-reassign */
/* eslint-disable indent */

const str2num = (n) => {
  if (Number.isNaN(+n)) return n;
  return +n;
};

function urlQueryParser(query) {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          const [key, value] = param.split('=');
          params[key] = value
            ? str2num(decodeURIComponent(value.replace(/\+/g, ' ')))
            : '';
          return params;
        }, {})
    : {};
}

export default urlQueryParser;
