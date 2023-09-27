/* curd */
const express = require('express')
const router = express.Router()
const demo_commentlike = require('../../mongoose_modules/commentlike_module')
const ObjectID = require('mongodb').ObjectId;
//修改某个评论对应的喜欢/赞数量
router.post("/updatacommentlike/:id", async (req, res) => {
    console.log(req.body.data.userid)
    console.log(req.params.id)
    try {
        const id = req.params.id
        const { userid } = req.body.data
        // 查找是否存在该用户的文档
        const data = await demo_commentlike.findOne({ userid: userid, commentid: id })

        if (data) {
            /* 存在把like设置为0 */
            // 根据文档不同设置不同的赞数
            const newlike = (data.like === 0) ? 1 : 0
            const newdata = await demo_commentlike.findOneAndUpdate(
                { userid: userid, commentid: id },
                { $set: { like: newlike } },
                { upsert: true, new: true },
            )
            return res.send(newdata)
        } else {
            /* 不存在就创建一个新的文档 */
            const newdata = new demo_commentlike({
                like: 1,
                userid: userid,
                commentid: id,
            })
            const datasave = await newdata.save();
            return res.send(datasave)
        }
    }
    catch (error) {
        res.status(505).json({ message: error.mesaage })
    }
})
module.exports = router;