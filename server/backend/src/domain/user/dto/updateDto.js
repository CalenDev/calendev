class UpdateReq {
  userId;
  userNickname;

  constructor() {}

  get getUserId() {
    return this.userId;
  }

  get getUserNickname() {
    return this.userNickname;
  }

  set setUserId(userId) {
    this.userId = userId;
  }

  set setUserNickname(userNickName) {
    this.userNickname = userNickName;
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
  ForgotPasswordReq,
  ResetPasswordReq,
};
