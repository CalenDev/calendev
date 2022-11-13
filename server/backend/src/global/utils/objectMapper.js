/* eslint-disable no-param-reassign */
const map = (req, userJoinReq) => {
  Object.getOwnPropertyNames(userJoinReq).forEach((cur, i) => {
    if (req[cur]) userJoinReq[cur] = req[cur];
  });
};

export default { map };
