const mongoose = require('../mongoose/mongoose');
const articles = new mongoose.Schema({
    /*     itemid: String, */
    name: String,
    title: String,
    content: String,
    /* 喜欢的id */
    likeid: { type: mongoose.Schema.Types.ObjectId, ref: 'likes' },
    /* 收藏的id */
    favoriteid: { type: mongoose.Schema.Types.ObjectId, ref: 'favorites' },
    /* 发布者的id */
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
})
const demo_articles = mongoose.model('articles', articles)
module.exports = demo_articles