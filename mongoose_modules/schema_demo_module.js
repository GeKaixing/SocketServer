const mongoose = require('../mongoose/mongoose');
// 创建模型_demo
const schema = new mongoose.Schema({

    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})
//第一个参数是一个单数形式
const Tank = mongoose.model('Tank', schema)
module.exports = Tank