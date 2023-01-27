import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from 'dayjs';

dayjs.extend(isSameOrBefore);
export function validateRegexEmail(email) {
  const reg = /^.+@.{2,}..{2,}$/;
  return reg.test(email);
}

export function validateRegexPassword(password) {
  const reg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return reg.test(password);
}

export function validateSinceAndEnd(since, end) {
  return dayjs(since).isSameOrBefore(dayjs(end));
}
