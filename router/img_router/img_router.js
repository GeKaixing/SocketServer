/* curd */
const express = require('express')
const router = express.Router()
const demo_imgs = require('../../mongoose_modules/img_module')
//上传图片 base64 方式一
router.post('/upload', async (req, res) => {
    console.log(req.body.data);
    try {
        const { filename, filesize, base64 } = req.body.data
        const data = demo_imgs.insertMany({
            filename,
            filesize,
            base64
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;