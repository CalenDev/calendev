import requestReg from './requestReg.js';

const validateEmail = (email) => {
  const reg = new RegExp(requestReg.emailReg);
  return reg.test(email);
};

const validateNickname = (nickName) => {
  const reg = new RegExp(requestReg.nicknameReg);
  return reg.test(nickName);
};

const validatePassword = (password) => {
  //MDN : new RegExp(...)로 하면 안됨. 이유는 모른다.
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
  }
};

export default {
  validateReq,
};
