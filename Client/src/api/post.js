import instance from './instance';
import { validateSinceAndEnd } from '../utils/validationCheck';
import changeDefaultTimeFormat from '../utils/change';

const getPostDetails = async (postId) => {
  try {
    const response = await instance.get(
      `/api/v1/posts/details/${postId}`,
    );
    return response;
  } catch (e) {
    return e.response;
  }
};

const getSimplePostData = async (props) => {
  const { year, month } = props;
  try {
    const response = await instance.get(
      `/api/v1/posts/dataType/simple?year=${year}&month=${month}`,
    );
    return response;
  } catch (e) {
    return e.response;
  }
};

const postAddBookmark = async (postId) => {
  try {
    const response = await instance.post('/api/v1/posts/bookmark', {
      postId,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

const postAddPost = async (eventPost) => {
  try {
    const response = await instance.post('/api/v1/posts', eventPost);

    return response;
  } catch (e) {
    return {
      status: e.response.status,
    };
  }
};

const postDeletePost = async (postId) => {
  try {
    const response = await instance.post('/api/v1/posts/delete', {
      postId,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

const postSearchByOptions = async (props) => {
  const { since, end, page, limit, sortBy, inputString, tags } = props;
  const makeQueryString = () => {
    const queryStringObj = {
      page,
      limit,
    };

    // 시작일과 끝일이 올바른가? => 올바르지 않을 경우 자동적으로 넣지 않음.
    if (validateSinceAndEnd(since, end)) {
      queryStringObj.since = changeDefaultTimeFormat(since);
      queryStringObj.end = changeDefaultTimeFormat(end);
    }

    // 검색어가 입력되었는가?
    if (inputString.length > 0) {
      queryStringObj.inputString = inputString;
    }

    // 정렬 조건이 있는가?
    if (sortBy.length > 0) {
      queryStringObj.sortBy = sortBy;
      if (sortBy === 'eventStartDttm') {
        queryStringObj.since = changeDefaultTimeFormat(new Date());
        delete queryStringObj.end;
      }
    }
    return Object.entries(queryStringObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  };

  try {
    const response = await instance.post(
      `/api/v1/posts/search?${makeQueryString()}`,
      {
        tags,
      },
    );
    return response;
  } catch (e) {
    return e.response;
  }
};

const patchRemoveBookmark = async (postId) => {
  try {
    const response = await instance.patch('/api/v1/posts/bookmark', {
      postId,
    });
    return response;
  } catch (e) {
    return e.response;
  }
};
export {
  getPostDetails,
  getSimplePostData,
  postAddBookmark,
  postAddPost,
  postDeletePost,
  postSearchByOptions,
  patchRemoveBookmark,
};
