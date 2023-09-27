/* curd */
const express = require('express')
const router = express.Router()
const ObjectID = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');
const Name_password = require('../../mongoose_modules/uesrinfo_module')
// 根据用户id查数据
router.get("/queryone/:id", async  (req, res) => {
    console.log(req.params.id);
    try {
        const data = await Name_password.findById({ _id: req.params.id });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 登录endpoint
router.post('/login', async (req, res) => {
    console.log(req.body);
    const name = req.body.data.name
    const password = req.body.data.password
    const name_password = {
        name: req.body.data.name,
        password: req.body.data.password
    }
    const token = jwt.sign(name_password, "hhhhhh", {
        expiresIn: 60 * 60 * 24 * 30
    })
    try {
        const finddata = await Name_password.findOne({
            name: req.body.data.name,
            password: req.body.data.password
        })
        if (finddata) {
            res.json({
                "name": finddata.name,
                '_id': finddata._id,
                'loginstate': true,
                'token': finddata.token
            })
        } else {
            res.json({
                'loginstate': false
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 查询账号
router.get("/queryname/:id", async (req, res) => {
    const id = req.params.id
    console.log(id);
    try {
        const data = await Name_password.findOne({ _id: id })
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
})

// 注册AIP
router.post('/signup', async (req, res) => {
    console.log(req.body);
    const name = req.body.data.name
    const password = req.body.data.password
    const name_password = {
        name: req.body.data.name,
        password: req.body.data.password
    }
    const token = jwt.sign(name_password, "hhhhhh", {
        expiresIn: 60 * 60 * 24 * 30
    })
    const data = new Name_password({
        token,
        name,
        password
    })
    try {
        if (await Name_password.findOne({ name: data.name })) {
            res.json({
                'signupstate': false
            })
        } else {
            const dataToSave = await data.save()
            res.status(200).json({ 'signupstate': true, dataToSave})
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 用户状态
// 点赞哪篇文章
//收藏
// 转发

router.get('/userstate/:id', async (req, res) => {
    const id = req.params.id
    console.log(`用户${id}`);
    try {

        const data = await Name_password.aggregate([
            // 根据用户id查询点赞的文章及收藏 
            {
                $match: {
                    _id: { $eq: new ObjectID(`${id}`) }
                }
            },
            {
                $lookup: {
                    from: 'likes',  // 关联的集合
                    localField: '_id',  // 本地关联的字段
                    foreignField: 'userid',  // 对方集合关联的字段
                    as: 'likes',  // 结果字段名,
                }
            },
            {
                $lookup: {
                    from: 'favorites',  // 关联的集合
                    localField: '_id',  // 本地关联的字段
                    foreignField: 'userid',  // 对方集合关联的字段
                    as: 'favorites',  // 结果字段名,
                }
            },
            {
                $project: {
                    name: '$name',
                    like_articleid: "$likes.articleid",
                    favorites_articleid: "$favorites.articleid"
                }
            }
        ])
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

module.exports = router;