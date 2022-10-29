function validateEmail(email) {
  const reg = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  // /^.+@.{2,}\..{2,}$/ => 교체, 공통커밋
  return reg.test(email);
}

export { validateEmail };
