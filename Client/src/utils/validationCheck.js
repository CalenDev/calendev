import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from 'dayjs';

dayjs.extend(isSameOrBefore);
function validateRegexEmail(email) {
  const reg = /^.+@.{2,}..{2,}$/;
  return reg.test(email);
}

function validateRegexPassword(password) {
  const reg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return reg.test(password);
}

function validateRegexPhone(phone) {
  const reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return reg.test(phone);
}

function validateRegexPlace(place) {
  const reg =
    /(([가-힣A-Za-z·\d~\-.]{2,}(로|길).[\d]+)|([가-힣A-Za-z·\d~\-.]+(읍|동)\s)[\d]+)/;
  return reg.test(place);
}

function validateSinceAndEnd(since, end) {
  return dayjs(since).isSameOrBefore(dayjs(end));
}

export {
  validateRegexEmail,
  validateRegexPassword,
  validateRegexPhone,
  validateRegexPlace,
  validateSinceAndEnd,
};
