export default {
  emailReg: '^.+@.{2,}..{2,}$',

  nicknameReg: '^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{1,30}$',

  passwordReg: '^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$',
};
