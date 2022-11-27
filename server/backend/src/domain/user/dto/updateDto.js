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

export default {
  UpdateReq,
  UpdateRes,
};
