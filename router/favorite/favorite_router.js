
const express = require('express')
const router = express.Router()
const demo_favorite = require('../../mongoose_modules/favorite_module')
//文章的收藏数 favorite
router.post('/upfavorite/:id', async (req, res) => {

    console.log(req.body.data)
    try {
        const id = req.params.id
        const { userid } = req.body.data
        // 查找是否存在该用户的文档
        const data = await demo_favorite.findOne({ userid: userid, articleid: id })

        if (data) {
            /* 存在把like设置为0 */
            // 根据文档不同设置不同的赞数
            const newlike = (data.favorite === 0) ? 1 : 0
            const newdata = await demo_favorite.findOneAndUpdate(
                { userid: userid, articleid: id },
                { $set: { favorite: newlike } },
                { upsert: true, new: true },
            )
            return res.send(newdata)
        } else {
            /* 不存在就创建一个新的文档 */
            const newdata = new demo_favorite({
                favorite: 1,
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