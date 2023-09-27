const mongoose = require('../mongoose/mongoose');
const reply = new mongoose.Schema({
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'names' }],
    username: String,
    reply: String,
    cid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
})
const demo_reply = mongoose.model('replies', reply)
module.exports = demo_reply