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
    default:
      return false;
  }
};

export default {
  validateReq,
};
