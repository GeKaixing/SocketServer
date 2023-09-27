/* curd */
const express = require('express')
const router = express.Router()
const demo_like = require('../../mongoose_modules/like_module')
const ObjectID = require('mongodb').ObjectId;
//修改某个文章对应的喜欢/赞数量
router.post("/updataarticlelike/:id", async (req, res) => {
    console.log(req.body.data)
    try {
        const id = req.params.id
        const { userid } = req.body.data
        // 查找是否存在该用户的文档
        const data = await demo_like.findOne({ userid: userid, articleid: id })

        if (data) {
            /* 存在把like设置为0 */
            // 根据文档不同设置不同的赞数
            const newlike = (data.like === 0) ? 1 : 0
            const newdata = await demo_like.findOneAndUpdate(
                { userid: userid, articleid: id },
                { $set: { like: newlike } },
                { upsert: true, new: true },
            )
            return res.send(newdata)
        } else {
            /* 不存在就创建一个新的文档 */
            const newdata = new demo_like({
                like: 1,
                userid: userid,
                articleid: id,
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