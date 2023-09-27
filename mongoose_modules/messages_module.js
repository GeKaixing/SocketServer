const mongoose = require('../mongoose/mongoose');
const msgs = new mongoose.Schema({
    comment: String,
    like: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
})
const demo_msgs = mongoose.model('msgs', msgs)
module.exports = demo_msgs;