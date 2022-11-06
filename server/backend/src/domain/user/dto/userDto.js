class UserUpdateReq {
  userEmail;
  userNickname;
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
  set setUserEmail(userEmail) {
    this.userEmail = userEmail;
  }
  set setUserNickname(userNickName) {
    this.userNickname = userNickName;
  }
  set setUserRoleCd(userRoleCd) {
    this.userRoleCd = userRoleCd;
  }
}
