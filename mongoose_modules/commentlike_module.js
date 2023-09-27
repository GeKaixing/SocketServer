const mongoose = require('../mongoose/mongoose');
const commentlike = new mongoose.Schema({
    // 评论的赞
    like: {
        type: Number,
        required: true,
        min: 0, // 设置最小值
        max: 1, // 设置最大值
    },
    /* 发布者的id */
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    // 评论的id
    commentid: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },
})
const demo_commentlike = mongoose.model('commentlikes', commentlike)
module.exports = demo_commentlike