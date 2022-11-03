class JoinReq {
  userEmail;
  userNickname;
  userPassword;
  userRoleCd;
  salt;

  constructor() {}

  get getUserEmail() {
    return this.userEmail;
  }
  get getUserNickName() {
    return this.userNickname;
  }
  get getUserRoleCd() {
    return this.userRoleCd;
  }
  get getUserPassword() {
    return this.userPassword;
  }
  get getSalt() {
    return this.salt;
  }
  set setUserEmail(userEmail) {
    this.userEmail = userEmail;
  }
  set setUserNickname(userNickName) {
    this.userNickname = userNickName;
  }
  set setUserRoleCd(userRoleCd) {
    this.userRoleCd = userRoleCd;
  }
  set setUserPassword(userPassword) {
    this.userPassword = userPassword;
  }
  set setSalt(salt) {
    this.salt = salt;
  }
}
class DuplicateValidationReq {
  target;
  authType;

  constructor() {}
  get getTarget() {
    return this.target;
  }
  get getAuthType() {
    return this.authType;
  }
  set setTarget(target) {
    this.target = target;
  }
  set setAuthType(authType) {
    this.authType = authType;
  }
}

class JoinRes {
  constructor() {}
}

class DuplicateValidationRes {
  isUserUnique;

  constructor() {}

  get getIsUserUnique() {
    return this.isUserUnique;
  }
  set setIsUserUnique(isUserUnique) {
    this.isUserUnique = isUserUnique;
  }
}
