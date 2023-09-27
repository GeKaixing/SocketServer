const article_router = require('../articles/article_router')
const Name_password_router = require('../Name_password/Name_password_router')
const comment_router = require('../comment/comment_router')
const favorite_router = require('../favorite/favorite_router')
const img_router = require('../img_router/img_router')
const img_url_router = require('../img_url/img_url_router')
const like_router = require('../like/like_router')
const message_router = require('../message/message_router')
const reply_router = require('../reply/reply_router')
const test_router = require('../schema/test_router')
const commentlike_router = require('../commentlike/commentlike_router')
const router_array = [
    article_router,
    Name_password_router,
    comment_router,
    favorite_router,
    img_router,
    img_url_router,
    like_router,
    message_router,
    reply_router,
    test_router,
    commentlike_router
]
module.exports = router_array;
