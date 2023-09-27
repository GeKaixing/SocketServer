const mongoose = require('../mongoose/mongoose');
// 账号模型
const Uesrinfo = new mongoose.Schema({
    token: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
    ,
    haedimg: {
        type: String
    }
})
const Name_password = mongoose.model('names', Uesrinfo)
module.exports = Name_password