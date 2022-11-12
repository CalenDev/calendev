function validateEmail(email) {
  const reg = /^.+@.{2,}\..{2,}$/;
  return reg.test(email);
}

function validatePhone(phone) {
  const reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return reg.test(phone);
}

function validatePlace(place) {
  const reg =
    /(([가-힣A-Za-z·\d~\-.]{2,}(로|길).[\d]+)|([가-힣A-Za-z·\d~\-.]+(읍|동)\s)[\d]+)/;
  return reg.test(place);
}

export { validateEmail, validatePhone, validatePlace };
