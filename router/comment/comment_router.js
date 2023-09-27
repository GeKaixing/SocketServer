/* curd */
const express = require('express')
const router = express.Router()
const demo_comment = require('../../mongoose_modules/comments_module')
const ObjectID = require('mongodb').ObjectId;
// create one comment API
router.post("/createcomment", async (req, res) => {
    console.log(req.body.data);
    const { comment, articleid, itemid } = req.body.data
    const data = new demo_comment({
        comment,
        articleid,
        itemid
    })
    try {
        const dataToSave = await data.save()
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
)

// 根据id添加评论
router.post("/postcomment", async (req, res) => {
    console.log(req.body.data);
    // 判断是否有userid
    try {
        const { userid, comment, articleid, likes } = req.body.data
        const data = new demo_comment(
            {
                userid,
                comment,
                articleid,
                likes
            }
        )
        const dataToSave = await data.save()
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(500).json({ message: error.mesaage })
    }
})

// 查询对应文章的所有评论
router.get("/getallcomment/:id", async (req, res) => {
    try {
        const id = req.params.id
        // const datas = await demo_comment.find({'articleid': { $eq: new ObjectID('64a3e1d1d7687e67a5fadb6d') } })
        const data = await demo_comment.aggregate([ //本地
            {
                $match: { 'articleid': { $eq: new ObjectID(`${id}`) } }
            }, {
                $lookup: {
                    from: 'replies',  // 关联的集合
                    localField: '_id',  // 本地关联的字段
                    foreignField: 'cid',  // 对方集合关联的字段
                    as: 'replycontent',  // 结果字段名,
                }
            }, {
                $lookup: {
                    from: 'names',  // 关联的集合
                    localField: 'userid',  // 本地关联的字段
                    foreignField: '_id',  // 对方集合关联的字段
                    as: 'namescontent',  // 结果字段名,
                }
            }, {
                $lookup: {
                    from: 'commentlikes',  // 关联的集合
                    localField: '_id',  // 本地关联的字段
                    foreignField: 'commentid',  // 对方集合关联的字段
                    as: 'commentlikes',  // 结果字段名,
                }
            },
            {
                $project: {
                    articleid: '$articleid',
                    usernames: "$namescontent.name",
                    userid: "$namescontent._id",
                    comment: '$comment',
                    replycontent: '$replycontent',
                    likes: {
                        $sum: "$commentlikes.like"
                    },
                    delete:true
                }
            }

        ])


        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 聚合查询 查询对应的所有回复---代废除
router.get('/getreplycontent', async (req, res) => {

    try {
        const data = await demo_comment.aggregate([ //本地

      /*   {
            $match:{
                "cid":{$eq:[cid]}
            }
        }, */{
                $lookup: {
                    from: 'replies',  // 关联的集合
                    localField: 'reply',  // 本地关联的字段
                    foreignField: '_id',  // 对方集合关联的字段
                    as: 'replycontent',  // 结果字段名,
                }
            }, {
                $lookup: {
                    from: 'names',  // 关联的集合
                    localField: 'userid',  // 本地关联的字段
                    foreignField: '_id',  // 对方集合关联的字段
                    as: 'namscontent',  // 结果字段名,
                }
            },

        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//这是删除评论的api
router.post('/updatacommentdelete', async (req, res) => {
    try {
        const data = await demo_comment.findByIdAndUpdate(
            { _id: req.body.data.commentid, userid: req.body.data.userid },
            { $set: { delete:true ,comment:'评论已经删除'} },
            { new: true })
        res.json(data)
    } catch (error) {
        res.status(505).json({ message: error.messaage })
    }
})
module.exports = router;