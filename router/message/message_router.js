/* curd */
const express = require('express')
const router = express.Router()
const demo_msgs = require('../../mongoose_modules/messages_module')

// 储存用户评论API
router.post('/upcomment', async (req, res) => {
    const { comment, like, user, article } = req.body.data
    const datas = new demo_msgs({
        comment,
        like,
        user,
        article
    })
    try {
        const dataToSave = await datas.save()
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;