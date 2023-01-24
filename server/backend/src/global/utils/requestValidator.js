const validateEmail = (email) => {
  const reg = /^.+@.{2,}..{2,}$/;
  return reg.test(email);
};

const validateNickname = (nickName) => {
  const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{1,30}$/;
  return reg.test(nickName);
};

const validatePassword = (password) => {
  // MDN : new RegExp(...)로 하면 안됨. 이유는 모른다.
  const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return reg.test(password);
};
const validateYear = (year) => {
  const reg = /^[0-9]*/;
  return reg.test(year) && Number(year) > 0;
};

const validateMonth = (month) => {
  const reg = /[0-9]{1,2}/;
  return reg.test(month) && Number(month) >= 1 && Number(month) <= 12;
};

const validateMonthDay = (year, month, day) => {
  const reg = /[0-9]{1,2}/;
  const lastDay = new Date(year, month, 0).getDate();
  return reg.test(day) && day >= 1 && day <= lastDay;
};

const validateDttm = (year, month) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  validateYear(year) && validateMonth(month);

const validateReq = (req, serviceName) => {
  switch (serviceName) {
    case 'login':
      return (
        validateEmail(req.getUserEmail) && validatePassword(req.getUserPassword)
      );

    case 'signup':
      return (
        validateEmail(req.getUserEmail) &&
        validateNickname(req.getUserNickname) &&
        validatePassword(req.getUserPassword)
      );
    case 'email':
      return validateEmail(req.getUserEmail);
    case 'resetPW':
      return validatePassword(req.getUserPassword);
    case 'year':
      return validateYear(req.getYear);
    case 'month':
      return validateMonth(req.getMonth);
    case 'dttm':
      return validateDttm(req.getYear, req.getMonth);
    default:
      return false;
  }
};

export default {
  validateReq,
  validateYear,
  validateMonth,
  validateMonthDay,
};
