#!/usr/bin/env node
// shell

// 解析终端输入信息
const program = require('commander')
const webServer = require('./server/server')
const spider = require('./server/spider')
const spiderPort = 4000

program
    .command('watch <port>')
    .action(function(port){
        // 启动路由控制器
        webServer(port)

        // 启动爬虫服务
        spider.fatchServer(spiderPort)
    })

program.parse(process.argv)