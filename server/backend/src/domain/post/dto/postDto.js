class PostSaveReq {
  userId;
  userNickname;
  userRoleCd;
  postTitle;
  postContent;
  postThumbnailImg;
  postImg;
  postTag;
  postPlace;
  postContactPhone;
  eventStartDttm;
  eventEndDttm;
  createdAtDttm;

  constructor() {}

  get getUserId() {
    return this.userId;
  }
  get userNickname() {
    return this.userNickname;
  }
  get userRoleCd() {
    return this.userRoleCd;
  }
  get getPostTitle() {
    return this.postTitle;
  }
  get getPostContent() {
    return this.postContent;
  }
  get getPostThumbnailImg() {
    return this.postThumbnailImg;
  }
  get getPostImg() {
    return this.postImg;
  }
  get getPostTag() {
    return this.postTag;
  }
  get getPostPlace() {
    return this.postPlace;
  }
  get getPostContactPhone() {
    return this.postContactPhone;
  }
  get getEventStartDttm() {
    return this.eventStartDttm;
  }
  get getEventEndDttm() {
    return this.eventEndDttm;
  }
  get getCreatedAtDttm() {
    return this.createdAtDttm;
  }
}
class PostEditReq {
  userId;
  postId;
  postTitle;
  postContent;
  postThumbnailImg;
  postImg;
  postTag;
  postPlace;
  postContactPhone;
  eventStartDttm;
  eventEndDttm;

  constructor() {}
  get getUserId() {
    return this.userId;
  }

  get getPostId() {
    return this.postId;
  }
  get getPostTitle() {
    return this.postTitle;
  }
  get getPostContent() {
    return this.postContent;
  }
  get getPostThumbnailImg() {
    return this.postThumbnailImg;
  }
  get getPostImg() {
    return this.postImg;
  }
  get getPostTag() {
    return this.postTag;
  }
  get getPostPlace() {
    return this.postPlace;
  }
  get getPostContactPhone() {
    return this.postContactPhone;
  }
  get getEventStartDttm() {
    return this.eventStartDttm;
  }
  get getEventEndDttm() {
    return this.eventEndDttm;
  }
}

class PostDetailReq {
  postId;
  remoteIP;

  constructor(postId, remoteIP) {
    this.postId = postId;
    this.remoteIP = remoteIP;
  }

  get getPostId() {
    return this.postId;
  }
  get getRemoteIP() {
    return this.remoteIP;
  }
}

class SimplePostDataReq {
  year;
  month;
  constructor() {}

  get getYear() {
    return this.year;
  }
  get getMonth() {
    return this.month;
  }
}
class PostDeleteReq {
  postId;
  constructor() {}

  get getPostId() {
    return this.postId;
  }
}
export default {
  PostSaveReq,
  PostEditReq,
  PostDeleteReq,
  PostDetailReq,
  SimplePostDataReq,
};
