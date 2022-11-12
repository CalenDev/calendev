import axios from 'axios';

const postEventPost = async (eventPost) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/posts`;

  try {
    const res = await axios.post(API_END_POINT, {
      ...eventPost,
    });

    return {
      status: res.status,
    };
  } catch (e) {
    return {
      status: e.response.status,
    };
  }
};

const postEventPostImageUpload = async (blob) => {
  const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/posts/imageUrl`;

  try {
    const res = await axios.post(API_END_POINT, blob, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return {
      status: res.status,
      imgUrl: res.imageUrl,
    };
  } catch (e) {
    return {
      status: e.response.status,
    };
  }
};

export { postEventPost, postEventPostImageUpload };
