const mongoose = require('../mongoose/mongoose');
const imgs = new mongoose.Schema({
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'names' }],
    filename: String,
    filesize: Number,
    base64: String,
})
const demo_imgs = mongoose.model('imgs', imgs)
module.exports = demo_imgs;