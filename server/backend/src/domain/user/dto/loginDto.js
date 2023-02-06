class UserLoginReq {
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
class UserLoginRes {
  accessToken;
  refreshToken;
  userRoleCd;
  userId;

  constructor() {}

  get getAccessToken() {
    return this.accessToken;
  }
  get getRefreshToken() {
    return this.refreshToken;
  }
  get getUserRoleCd() {
    return this.userRoleCd;
  }
  get getUserId() {
    return this.userId;
  }
  set setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
  set setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }
  set setUserRoleCd(userRoleCd) {
    this.userRoleCd = userRoleCd;
  }
}

export default { UserLoginReq, UserLoginRes };
