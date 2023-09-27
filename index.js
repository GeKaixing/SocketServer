const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require("socket.io");
const cookieparser = require('cookie-parser');
const bodyParser = require('body-parser')
const fs = require('fs')
//暴露静态文件
app.use(express.static('upload'))
const PORT = 4000
// 设置图品存储的文件夹
// 第一个参数是对象,设置请求来的图品存储的位置(文件夹)
// 注册中间件
// app.use(express.bodyParser({uploadDir:'./uploads'}))
const path = require("path")
const ObjectID = require('mongodb').ObjectId;
//引入jwt
var jwt = require('jsonwebtoken');
//设置请求大小限制
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// 解析请求数据
app.use(bodyParser.urlencoded({ extended: true }))
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
const routerarr=require('./router/router/router')
app.use([...routerarr]);
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
