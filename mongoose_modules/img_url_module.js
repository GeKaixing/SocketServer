const mongoose = require('../mongoose/mongoose');
const url = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    filename: String,
    url: String
})
const demo_url = mongoose.model('url', url)
module.exports = demo_url;