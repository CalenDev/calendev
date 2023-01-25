import instance from './instance';

const postSearchByOptions = async () => {
  try {
    const response = await instance.post('/search');
    return response;
  } catch (e) {
    return e.response;
  }
};

export default postSearchByOptions;
