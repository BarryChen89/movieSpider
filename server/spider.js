/**
 * Created by wenqi.chen on 2017/6/13.
 */
/***
 * 依赖库引入
 */
const http = require('http') // http服务模块
const superagent = require('superagent') // 客户端请求代理模块
const async = require('async')  // 异步模块
const eventproxy = require('eventproxy') // 并发模块
const ep = new eventproxy()
const opn = require('opn') // 打开浏览器
const cheerio = require('cheerio') // 类似jquery

/**
 * 全局变量初始化
 */
const baseUrl = 'http://www.80s.tw/movie/list'
let pageUrls = [] // 分页列表页面地址
let movieUrls = [] // 解析到的电影详情页地址
let movieInfo = [] // 电影下载链接
for(let i=1; i<5; i++){
    pageUrls.push(baseUrl+'/-----p'+i)
}
const fs = require('fs')
let dbPath = 'movie.json'
let num = 0 // 记录并发数

function fatchServer (port){
    /**
     * 解析列表页，获取每个电影的详情页地址
     */
    function requestPages(){
        // 启动并发请求
        pageUrls.forEach( (url) => {
            superagent
                .get(url)
                .end( (err, res) => {
                    ep.emit('pickPagesUrl', res.text)
                })
        })

        // 并发全部完成后调用 通过第一个参数关联，第二个参数为总请求数
        ep.after('pickPagesUrl',pageUrls.length,(resTxt) => {
            resTxt.map( (_res) => {
                let $ = cheerio.load(_res)
                let _urls = $('.me1 a')
                for(let i=0; i<_urls.length; i+=2){
                    movieUrls.push( 'http://www.80s.tw' + $(_urls[i]).attr('href') )
                }
            })

            // 启动并发获取电影下载链接函数
            requestMovies()
        });
    }

    /**
     * 解析详情页地址，获取电影迅雷下载链接
     */
    function requestMovies(){
        // 启动并发请求
        movieUrls.forEach( (url) => {
            num++
            console.log('++当前并发数：',num)
            superagent
                .get(url)
                .end( (err, res) => {
                    num--
                    console.log('--当前并发数：',num)
                    ep.emit('pickDownloadUrl', res.text)
                })
        })

        // 并发全部完成后调用 通过第一个参数关联，第二个参数为总请求数
        ep.after('pickDownloadUrl',movieUrls.length,(resTxt) => {
            resTxt.map( (_res) => {
                let $ = cheerio.load(_res)
                //收集数据
                let downloadUrl = $('#myform .dlbutton1').find('a').attr('href')
                let name = $('#minfo h1').text()
                let img = $('#minfo .img img').attr('src')
                movieInfo.push({
                    'name' : name,
                    'downloadUrl' : downloadUrl,
                    'img':img
                })
            })
            console.log(movieInfo)
            console.log('Completed! Fatch '+ movieInfo.length +' in total.')

            saveMovie();
        });
    }

    /**
     * 存储下载地址
     */
    function saveMovie(){
        let movieData = '{"movies":'+ JSON.stringify(movieInfo) +'}'
        fs.writeFile(dbPath, movieData, (err) => {
            if (err) throw err;
            console.log('File write completed !')
        });
    }

    console.log('Fatch server start at port:'+port)
    http.createServer(requestPages).listen(port)
}

function fatchStart (port){
    opn('http://localhost:' + port);
}

module.exports = {
    'fatchStart' : fatchStart,
    'fatchServer' : fatchServer
}