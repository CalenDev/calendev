import axios from 'axios';

const getSearchTags = async (searchTags) => {
  try {
    const { data } = await axios.get({
      tags: searchTags,
    });

    return data;
  } catch (e) {
    return e;
  }
};

export default getSearchTags;
