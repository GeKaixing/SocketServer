//引入mongoose数据库
const mongoose = require('mongoose');
// 连接mongodb数据库
mongoose.connect("mongodb://localhost:27017").catch(error => handleError(error))
// mongodb数据库连接错误事件
mongoose.connection.on('error', (error) => {
    console.log(error)
})
// mongodb数据库连接成功事件
mongoose.connection.once('connected', () => {
    console.log('数据库连接成功');
})
/* 并将model暴露，这样操作user集合只需要引入User.js文件就可以了 */
module.exports = mongoose;