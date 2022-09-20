// const knex = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host: '127.0.0.1',
//     port: '3306',
//     user: 'root',
//     password: 'ansekgns421!',
//     database: 'calendev',
//   },
// });

// // knex
// //   .raw('select * from user')
// //   .then((resp) => {
// //     console.log(resp);
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// https: module.exports = knex;

module.exports = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root', // 실제 서비스에서는 root 계정을 사용하지 않는 것이 좋습니다.
    password: 'ansekgns421!',
    database: 'calendev',
  },
});
