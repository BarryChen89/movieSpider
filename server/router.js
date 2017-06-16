/**
 * Created by wenqi.chen on 2017/6/15.
 */
const express = require('express')
const router = express.Router()
const session = require('session')
const spider = require('./spider')
const ejs = require('ejs')
const spiderPort = 4000
const fs = require('fs')
let dbPath = 'movie.json'
const everyPage = 12
router.use( (req, res, next) => {
    console.log('Time: ',new Date());
    console.log('Client IP: ', getClientIp(req));
    next();
})

router.get('/crawlMovie',() => {
    // 启动爬虫
    spider.fatchStart(spiderPort)
})

router.get('/', (req, res) => {
    res.redirect('login')
})

router.get('/login',(req,res) => {
    res.render('login', { title: '欢迎登录' })
})

router.get('/list',(req,res) => {
    let newData = getFile(1)
    res.render('list', newData)
})
router.get('/list/:page',(req,res) => {
    let page = req.params.page
    let newData = getFile(page);
    res.render('list', newData)
})

router.post('/loginUser',(req,res) => {
    let body = req.body
    if(body.userName == "cwq" && body.userPwd == "123456"){
        res.redirect('list')
    }else{
        res.render('login', { title: 'login in' })
    }
})

let getClientIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

let getFile = (page) => {
    // 同步获取数据
    let jsonData = fs.readFileSync(dbPath,'utf8')
    // 转成json类型
    let movieData = JSON.parse(jsonData)
    let movieLen = movieData.movies.length
    // 每页显示10个，得出分页数
    let pageNum = Math.ceil(movieLen / everyPage)

    // 返回新对象
    let result = {}
    result.movies = []
    result.totalPages = pageNum
    result.curPage = page

    // 循环上限，超过电影总数，显示电影总数
    let limit = (movieLen<everyPage*page)?movieLen:everyPage*page
    // 获取指定页码的文件
    for(let i=everyPage*(page-1); i < limit ; i++){
        result.movies.push(movieData.movies[i])
    }
    return result
}

module.exports = router