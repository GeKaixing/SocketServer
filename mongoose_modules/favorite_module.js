const mongoose = require('../mongoose/mongoose');
const favorite = new mongoose.Schema({
    favorite: {
        type: Number,
        required: true,
        min: 0, // 设置最小值
        max: 1, // 设置最大值
    },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    articleid: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
})
const demo_favorite = mongoose.model('favorites', favorite)
module.exports = demo_favorite