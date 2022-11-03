const map = function (req, userJoinReq) {
  Object.getOwnPropertyNames(userJoinReq).forEach((cur, i) => {
    if (req[cur]) userJoinReq[cur] = req[cur];
  });
  console.log(userJoinReq);
};

export default { map };
