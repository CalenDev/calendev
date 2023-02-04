class UpdateReq {
  userEmail;
  userNickname;
  userPassword;
  userRoleCd;

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
}
class UpdateRes {
  userEmail;
  userNickname;
  userPassword;
  userRoleCd;

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
}

class ForgotPasswordReq {
  userEmail;
  userPassword;
  constructor() {}

  get getUserEmail() {
    return this.userEmail;
  }
  get getUserPassword() {
    return this.userPassword;
  }
  set setUserEmail(userEmail) {
    this.userEmail = userEmail;
  }
  set setUserPassword(userPassword) {
    this.userPassword = userPassword;
  }
}
class ResetPasswordReq {
  userId;
  prevUserPassword;
  changedUserPassword;
  constructor() {}

  get getUserId() {
    return this.userId;
  }
  get getPrevUserPassword() {
    return this.prevUserPassword;
  }
  get getChangedUserPassword() {
    return this.changedUserPassword;
  }
}

export default {
  UpdateReq,
  UpdateRes,
  ForgotPasswordReq,
  ResetPasswordReq,
};
