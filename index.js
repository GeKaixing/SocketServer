const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require("socket.io");
const cookieparser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 4000
//引入jwt
var jwt = require('jsonwebtoken');
// 解析请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 解决跨域
app.use(cors(
    {
        origin: "http://localhost:3000"
    }
));
const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
// 连接mongoDB数据库
/* 
下载 安装mongoose
*/
//引入mongoose数据库
const mongoose = require('mongoose');
const { callWithAsyncErrorHandling } = require('vue');
const { consumers } = require('stream');
const { access } = require('fs');
// 连接mongodb数据库
mongoose.connect("mongodb://localhost:27017").catch(error => handleError(error))
// mongodb数据库连接错误事件
mongoose.connection.on('error', (error) => {
    console.log(error)
})
// mongodb数据库连接成功事件
mongoose.connection.once('connected', () => {
    console.log('数据库连接成功');
})
// 创建模型_demo
const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})
// 创建模型账号and密码
const Uesrinfo = new mongoose.Schema({
    token: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})
const articles = new mongoose.Schema({
    itemid: String,
    name: String,
    title: String,
    content: String,
    like: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
})
const comments = new mongoose.Schema({
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'names' }],
    itemid: String,
    comment: String,
    likes: Number,
    articleid: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
})
const reply = new mongoose.Schema({
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'names' }],
    reply: String,
    cid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
})
const msgs = new mongoose.Schema({
    comment: String,
    like: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'names' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'articles' },
})
const demo_msgs = mongoose.model('msgs', msgs)
const demo_articles = mongoose.model('articles', articles)
const Name_password = mongoose.model('names', Uesrinfo)
const demo_comment = mongoose.model('comments', comments)
const demo_reply = mongoose.model('replies', reply)
//第一个参数是一个单数形式
const Tank = mongoose.model('Tank', schema)
app.post('/post', async (req, res) => {
    const small = new Tank({
        name: req.body.name,
        age: req.body.age
    });
    try {
        const dataToSave = await small.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// 获取全部数据
app.get('/getAll', async (req, res) => {
    try {
        const data = await Tank.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id获取某个数据
app.get('/getOne/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        const data = await Tank.findById({ _id: req.params.id });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id更新数据
app.patch('/updata/:id', async (req, res) => {
    try {
        const id = { _id: req.params.id }
        const updataData = req.body
        const options = { new: true }
        const result = await Tank.findOneAndUpdate(id,
            updataData, options
        )
        res.send(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id删除数据
app.delete('/deleteone/:id', async (req, res) => {
    try {
        const id = { _id: req.params.id }
        const data = await Tank.findByIdAndDelete(id)
        res.send(`document with ${data.name}has been deleted..`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id查数据
app.get("/queryone/:id", async (req, res) => {
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
app.post('/login', async (req, res) => {
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
        const finddata = await Name_password.findOne({ name: req.body.data.name })

        if (finddata) {
            res.json({
                '_id': finddata._id,
                'loginstate': true
            })
        } else {
            res.json({
                'login': false
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 注册AIP
app.post('/signup', async (req, res) => {
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
            res.status(200).json({ 'signupstate': true, dataToSave })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 储存用户上传帖子API
app.post('/uploading', async (req, res) => {
    // console.log(req.body);
    const like = 0
    const { /* title, */name, content, user } = req.body.data
    const demo1 = new demo_articles({
        // title,
        name,
        content,
        like,
        user
    })
    try {
        const dataToSave = await demo1.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})
// 查询文章
app.get('/getarticles', async (req, res) => {
    // console.log(demo_articles.find().populate('user')
    // .then((res) => { console.log(res);}).catch((err) => { console.log(err);}));
    try {
        const data = await demo_articles.find().populate('user')
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 储存用户评论API
app.post('/upcomment', async (req, res) => {
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
// 废除api  查询文章对应的所以评论
/* app.get('/getcomment', async (req, res) => {
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
//查询某个文章对应的喜欢/赞数量
app.get('/getdataarticlelike/:id', async (req, res) => {
    // console.log(req.params.id);
    try {
        const data = await demo_articles.findById({ _id: req.params.id })
        res.json(data)
    }
    catch (error) {
        res.status(505).json({ message: error.message })
    }
})
//修改某个文章对应的喜欢/赞数量
app.post("/updataarticlelike/:id", async (req, res) => {
    console.log(req.body.data.like);
    try {
        const id = req.params.id
        const updata = req.body.data.like
        const data = await demo_articles.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    like: updata
                }
            }
        )
        res.send(data)
    }
    catch (error) {
        res.status(505).json({ message: error.mesaage })
    }
})
// create one comment API
app.post("/createcomment", async (req, res) => {
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
// 这个API待定 retrieve article
app.get('/retrievearticle', async (req, res) => {
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
            { $sort: { "likes": -1 } }
        ])
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//根据id获取文章
app.get("/getonearticle/:id", async (req, res) => {
    try {
        console.log(req.params);
        const _id = req.params.id
        const data = await demo_articles.findById(
            _id
        )
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id添加评论
app.post("/postcomment", async (req, res) => {
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
app.get("/getallcomment/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const id = req.params.id
        const data = await demo_comment.find({
            articleid: id
        }).populate('userid')
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 删除评论
// 回复评论
app.post('/postreply', async (req, res) => {
    console.log(req.body);
    try {
        const { cid, reply, userid } = req.body
        const data = await demo_reply.create({
            userid,
            cid,
            reply,
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.mesaage })
    }
})
// 查询对应的所有回复
app.get('/getreplycontent', async (req, res) => {
    try {
        const data = await demo_reply.aggregate([ //本地
            {
                $lookup: {
                    from: 'comments',  // 关联的集合
                    localField: 'cid',  // 本地关联的字段
                    foreignField: '_id',  // 对方集合关联的字段
                    as: 'replycontent',  // 结果字段名,
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.messsage })
    }
})
socketIO.on('connection', (socket) => {
    console.log(`${socket.id} 用户已连接!`);
    socket.on("msg", (data) => {
        console.log(data);
        socketIO.emit('sendmessage', data)
    })
    socket.on('disconnect', () => {
        console.log(`${socket.id}一个用户已断开连接!`);
    })
})
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
