export function validateEmail(email) {
  const reg = /^.+@.{2,}..{2,}$/;
  return reg.test(email);
}

export function validatePassword(password) {
  const reg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return reg.test(password);
}
