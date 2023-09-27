/* 根据mongoose_module分类 */
const express = require('express')
const router = express.Router()
const demo_articles = require('../../mongoose_modules/articles_module')
const demo_favorite = require('../../mongoose_modules/favorite_module')
const demo_like = require('../../mongoose_modules/like_module')
const ObjectID = require('mongodb').ObjectId;

router.use(function (req, res, next) {
    // add middleware
    console.log('Time:', Date.now())
    next();
})
// 获取文章的信息，点赞，收藏，id，发帖用户
router.get('/retrievearticle', async (req, res) => {
    try {
        const dataToSave = await demo_articles.aggregate([
            {
                $lookup: {
                    from: 'comments',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'comments',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'likes',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'favorites',  // 查询结果别名,
                }
            }
            , {
                $project: {
                    name: '$name',
                    content: '$content',
                    comments: { $size: "$comments" },
                    likes: { $sum: "$likes.like" },
                    favorites: { $sum: "$favorites.favorite" }
                }
            }
            /* ,
            {
                $unwind: "$likes"
            },
            {
                $unwind: "$likes.like"
            },
            {
                $unwind: "$favorites"
            },
            {
                $unwind: "$comments"
            },
            {
                $group: {
                    _id: '$_id',
                    name: { "$first": "$name" },
                    //  title: { "$first": "$title" }
                    content: { "$first": "$content" },
                    comments: { "$first": "$comments" },
                    likes: {
                        $sum: '$likes.like'
                    },
                    favorites: {
                        $sum: '$favorites.favorite'
                    }
                }
            },
 */
        ])
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 储存用户上传帖子API
router.post('/uploading', async (req, res) => {
    console.log(req.body);
    /*  const like = 0
     const favorite = 0 */
    const { /* title, */name, content, user } = req.body.data
    const demo1 = new demo_articles({
        // title,
        name,
        content,
        user,
    })
    try {
        const dataToSave = await demo1.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})
// 查询文章 这个api废除
router.get('/getarticles', async (req, res) => {
    // console.log(demo_articles.find().populate('user')
    // .then((res) => { console.log(res);}).catch((err) => { console.log(err);}));
    try {
        const data = await demo_articles.find().populate('user')
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//查询某个文章对应的喜欢/赞数量
router.get('/getdataarticlelike/:id', async (req, res) => {
    // console.log(req.params.id);
    try {
        const data = await demo_articles.findById({ _id: req.params.id })
        res.json(data)
    }
    catch (error) {
        res.status(505).json({ message: error.message })
    }
})
//根据文章id获取文章
router.get("/getonearticle/:id", async (req, res) => {
    try {
        /* console.log(req.params); */
        const id = req.params.id
        const data = await demo_articles.aggregate([
            {
                $match: { '_id': { $eq: new ObjectID(`${id}`) } }
            },
            {
                $lookup: {
                    from: 'comments',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'comments',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'likes',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'favorites',  // 查询结果别名,
                }
            },
            {
                $project: {
                    name: '$name',
                    content: '$content',
                    comments: "$comments"
                    ,
                    likes: {
                        $sum: "$likes.like"
                    },
                    favorites: {
                        $sum: "$favorites.favorite"
                    }
                }
            },
            { $sort: { "likes": -1 } }
        ])
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据用户id查询用户发布的文章
router.get('/userarticles/:id', async (req, res) => {
    try {
        // 获取用户id
        const id = req.params.id
        // 根据用户id聚合查询
        const data = await demo_articles.aggregate([
            {
                $match: { 'user': { $eq: new ObjectID(`${id}`) } }
            },
            {
                $lookup: {
                    from: 'comments',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'comments',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'likes',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 从表表名
                    localField: '_id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'favorites',  // 查询结果别名,
                }
            },
            {
                $project: {
                    name: '$name',
                    content: '$content',
                    comments: { $size: "$comments" },
                    likes: { $sum: "$likes.like" },
                    favorites: { $sum: "$favorites.favorite" }
                }
            },
            { $sort: { "likes": -1 } }
        ])
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// // 这个API待定 retrieve article
// router.get('/retrievearticle', async (req, res) => {
//     try {
//         const dataToSave = await demo_articles.aggregate([
//             {
//                 $lookup: {
//                     from: 'comments',  // 从表表名
//                     localField: '_id', // 主表关联与从表关联字段
//                     foreignField: 'articleid', // 从表与主表关联的字段
//                     as: 'comments',  // 查询结果别名,
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'likes',  // 从表表名
//                     localField: '_id', // 主表关联与从表关联字段
//                     foreignField: 'articleid', // 从表与主表关联的字段
//                     as: 'likes',  // 查询结果别名,
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'favorites',  // 从表表名
//                     localField: '_id', // 主表关联与从表关联字段
//                     foreignField: 'articleid', // 从表与主表关联的字段
//                     as: 'favorites',  // 查询结果别名,
//                 }
//             }
//             , {
//                 $project: {
//                     name: '$name',
//                     content: '$content',
//                     comments: "$comments"
//                     ,
//                     likes: {
//                         $sum: "$likes.like"
//                     },
//                     favorites: {
//                         $sum: "$favorites.favorite"
//                     }
//                 }
//             }
//             /* ,
//             {
//                 $unwind: "$likes"
//             },
//             {
//                 $unwind: "$likes.like"
//             },
//             {
//                 $unwind: "$favorites"
//             },
//             {
//                 $unwind: "$comments"
//             },
//             {
//                 $group: {
//                     _id: '$_id',
//                     name: { "$first": "$name" },
//                     //  title: { "$first": "$title" }
//                     content: { "$first": "$content" },
//                     comments: { "$first": "$comments" },
//                     likes: {
//                         $sum: '$likes.like'
//                     },
//                     favorites: {
//                         $sum: '$favorites.favorite'
//                     }
//                 }
//             },
//  */
//         ])
//         res.status(200).json(dataToSave)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// 废除api  查询文章对应的所以评论
/* router.get('/getcomment', async (req, res) => {
    try {
        const dataToSave = await demo_articles.aggregate([ //本地
            {
                $lookup: {
                    from: 'msgs',  // 关联的集合
                    localField: '_id',  // 本地关联的字段
                    foreignField: 'article',  // 对方集合关联的字段
                    as: 'mms',  // 结果字段名,
                }
            }
        ])
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}) */

// 根据用户id 查询收藏该用户收藏的文章并返回
router.get('/userfavorite/:id', async (req, res) => {

    try {
        const id = req.params.id
        console.log(id)
        const data = await demo_favorite.aggregate([
            {
                $match: { 'userid': { $eq: new ObjectID(`${id}`) } }
            },
            {
                $lookup: {
                    from: 'articles',  // 关联的集合
                    localField: 'articleid',  // 本地关联的字段
                    foreignField: '_id',  // 对方集合关联的字段
                    as: 'userfavorite',  // 结果字段名,
                }
            }

        ])
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.mesaage })
    }

})
// 根据用户id查询用户点赞的文章
// 筛选userid like=1 文档 
// 然后聚合查询articleid
router.get('/userlikearticles/:id', async (req, res) => {
    try {
        // 获取用户id
        const id = req.params.id
        // 获取用户点赞的文章
        // 根据用户id聚合查询
        const data = await demo_like.aggregate([
            {
                $match: { 'userid': { $eq: new ObjectID(`${id}`) }, "like": 1 }
            },
            {
                $lookup: {
                    from: 'articles',  // 从表表名
                    localField: 'articleid', // 主表关联与从表关联字段
                    foreignField: '_id', // 从表与主表关联的字段
                    as: 'articles',  // 查询结果别名,
                }
            },
            {
                $unwind: '$articles' // 展开关联的文章数组
            },
            {
                $lookup: {
                    from: 'comments',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'comments',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'likes',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'favorites',  // 查询结果别名,
                }
            },
            {
                $project: {
                    name: '$articles.name',
                    content: '$articles.content',
                    comments: { $size: "$comments" },
                    likes: { $sum: "$likes.like" },
                    favorites: { $sum: "$favorites.favorite" }
                }
            },
            { $sort: { "likes": -1 } }
        ])
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// 然后聚合查询articleid
router.get('/userfavoritearticles/:id', async (req, res) => {
    try {
        // 获取用户id
        const id = req.params.id
        // 获取用户点赞的文章
        // 根据用户id聚合查询
        const data = await demo_favorite.aggregate([
            {
                $match: { 'userid': { $eq: new ObjectID(`${id}`) }, "favorite": 1 }
            },
            {
                $lookup: {
                    from: 'articles',  // 从表表名
                    localField: 'articleid', // 主表关联与从表关联字段
                    foreignField: '_id', // 从表与主表关联的字段
                    as: 'articles',  // 查询结果别名,
                }
            },
            {
                $unwind: '$articles' // 展开关联的文章数组
            },
            {
                $lookup: {
                    from: 'comments',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'comments',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'likes',  // 查询结果别名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 从表表名
                    localField: 'articles._id', // 主表关联与从表关联字段
                    foreignField: 'articleid', // 从表与主表关联的字段
                    as: 'favorites',  // 查询结果别名,
                }
            },
            {
                $project: {
                    name: '$articles.name',
                    content: '$articles.content',
                    comments: { $size: "$comments" },
                    likes: { $sum: "$likes.like" },
                    favorites: { $sum: "$favorites.favorite" }
                }
            },
            { $sort: { "likes": -1 } }
        ])
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;
