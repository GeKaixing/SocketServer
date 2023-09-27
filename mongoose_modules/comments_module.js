const mongoose = require('../mongoose/mongoose');
const comments = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    itemid: String,
    comment: String,
    articleid: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
    replyid: { type: mongoose.Schema.Types.ObjectId, ref: 'replies' },
    delete:{
        type:Boolean,
        default:false
    }
})
const demo_comment = mongoose.model('comments', comments)
module.exports = demo_comment