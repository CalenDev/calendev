class PostSaveReq {
  userId;
  organizerId;
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
  get getOrganizerId() {
    return this.organizerId;
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
  organizerId;
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

  get getOrganizerId() {
    return this.organizerId;
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
  postTitle;

  constructor() {}

  get getPostId() {
    return this.postId;
  }
  get getPostTitle() {
    return this.postTitle;
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
