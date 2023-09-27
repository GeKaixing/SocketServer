const express = require('express')
const router = express.Router()
const Tank = require('../../mongoose_modules/schema_demo_module')
//test
router.post('/post', async (req, res) => {
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
router.get('/getAll', async (req, res) => {
    try {
        const data = await Tank.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// 根据id获取某个数据
router.get('/getOne/:id', async (req, res) => {
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
router.patch('/updata/:id', async (req, res) => {
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
router.delete('/deleteone/:id', async (req, res) => {
    try {
        const id = { _id: req.params.id }
        const data = await Tank.findByIdAndDelete(id)
        res.send(`document with ${data.name}has been deleted..`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;