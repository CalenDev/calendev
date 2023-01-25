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

/**
 * dttm 정보를 string으로 입력하면 유효성을 판단.
 * @param {string} dttm yyyy-mm-dd 형태의 dttm 데이터를 입력
 * @returns 입력한 데이터가 유효한 정보인지 확인.
 */
const validateDttm = (dttm) => {
  const dttmArr = dttm.split('-');
  const validationResult =
    validateYear(dttmArr[0]) &&
    validateMonth(dttmArr[1]) &&
    validateMonthDay(dttmArr[0], dttmArr[1], dttmArr[2]);
  return validationResult;
};

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
    default:
      return false;
  }
};

export default {
  validateReq,
  validateYear,
  validateMonth,
  validateMonthDay,
  validateDttm,
};
