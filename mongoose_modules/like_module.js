const mongoose = require('../mongoose/mongoose');
const like = new mongoose.Schema({
    like: {
        type: Number,
        required: true,
        min: 0, // 设置最小值
        max: 1, // 设置最大值
    },
    /* 发布者的id */
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    articleid: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
})
const demo_like = mongoose.model('likes', like)
module.exports = demo_like;