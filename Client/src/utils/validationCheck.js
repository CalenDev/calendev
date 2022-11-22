function validateEmail(email) {
  const reg = /^.+@.{2,}\..{2,}$/;
  return reg.test(email);
}

export default validateEmail;
