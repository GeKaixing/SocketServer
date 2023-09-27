var express = require('express');
var app = express()
const multer = require('multer')
const fs = require('fs')
const cors = require('cors')
/* GET home page. */
// 暴露静态文件
// 域名/文件名   即可访问
app.use(express.static('upload'));
app.use(cors({
    origin: "http://localhost:3000"
}))
app.post('/upload', multer({
    // 保存到的upload文件夹
    dest: 'upload'
})
    //接受前端'file'的字段的formdata
    .single('file'),
    (req, res) => {
        console.log(req.file);
        //fs模块修改文件的名字,第一个参数修改名字的文件,第二个修改后的名字
        //添加相同的的图片是不会添加到文件夹中
        fs.renameSync(req.file.path, `upload/${req.file.originalname}`)
        // 响应发送
        res.send(req.file)
    })

/*app.post('/upload', multer({
   // 保存到uoload文件夹
   dest: 'upload'
})
   //第一个参数:前端的formdata的'file'的字段
   //第二个参数:限制前端上传的最大数量
   .array('file', 10)
   , (req, res) => {
       const files = req.file
       //空对象
       const fileList = {}
       //遍历files
       for (var i in files) {
           var file = files[i]
           // 修改文件名
           fs.renameSync(file.path, `upload/${file.originalname}`)
           //重新赋值文件的路径
           file.path = `upload/${file.originalname}`
           //添加文件
           fileList.push(file)
       }
           //响应
       res.send(fileList)
   })*/
app.get('/download', (req, res) => {
    req.query.url ? res.download(`upload/${req.query.url}`) : res.send({
        success: false
    })
})
app.listen(8000, () => {
    console.log('connect-----8000');
})