/* curd */
const express = require('express')
const router = express.Router()
const demo_reply = require('../../mongoose_modules/reply_module')
const ObjectID = require('mongodb').ObjectId;
// 回复评论
router.post('/postreply', async (req, res) => {
    console.log(req.body.data);
    try {
        const { cid, reply, userid, name } = req.body.data
        const data = new demo_reply({
            username: name,
            userid,
            cid,
            reply,
        })
        const dataToSave = await data.save()
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.mesaage })
    }
})
// 查询对应的评论所有回复
router.get('/getreplycontents/:id', async (req, res) => {
    /*  console.log(req.params.id); */
    const commentid = req.params.id
    try {
        const data = await demo_reply.find({ "cid": { $eq: commentid } })
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.messsage })
    }
})
// 删除评论
router.delete('/deletereply/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        const id = { _id: req.params.id }

        const data = await demo_reply.deleteOne({ userid: id })
        res.send(`document with ${data}has been deleted..`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;