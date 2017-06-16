/**
 * Created by wenqi.chen on 2017/6/15.
 */
/**
 * Created by wenqi.chen on 2017/6/15.
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser') // 获取post请求内容
const cors = require('cors') // handle 跨域请求
const opn = require('opn')
const ejs = require('ejs')
const router = require('./router')

module.exports = function(port){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded( { extended: false }))
    app.use(cors())
    app.set('views', './views')
    app.set('view engine', 'ejs')
    app.use('/public',express.static('./public')) // 设置静态资源请求根目录
    app.use('/',router)

    app.listen(port,(err) => {
        if(err){
            console.log(err)
            return
        }
        console.log('Server start at port:',port)
        opn('http://localhost:' + port);
    })
}