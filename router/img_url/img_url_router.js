/* curd */
const express = require('express')
const router = express.Router()
const demo_url = require('../../mongoose_modules/img_url_module')
const fs = require('fs')
// 引入multer中间件处理请求的图品
const multer = require('multer');
// 上传图片 储存图品路径 方式2
router.post('/uploadformdata', multer({
    dest: 'upload'
}).single('file'), async (req, res) => {
    console.log(req.file);
    fs.renameSync(req.file.path, `upload/${req.file.originalname}`)
    try {
        const { originalname } = req.file
        const userid = '64a4320abd7acfcb0952e1da'
        const url = `http://127.0.0.1:4000/${originalname}`
        const data = await demo_url.insertMany({
            userid,
            url
        })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;