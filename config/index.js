/**
 * 配置文件
 */
module.exports = {
  URL: "mongodb://127.0.0.1:27017/parking_db", // 数据库地址
  unlessList: [/^\/api\/app\/login/], // 接口白名单
};
