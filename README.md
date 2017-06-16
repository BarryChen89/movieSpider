# movieSpider
Movie spider from http://www.80s.tw/ &amp; Web Server to show movie list.

---

本项目包含以下内容：
##### 1.自定义commander

##### 2.爬虫脚本
 1) 并发异步请求
 2) 结构解析、数据爬取
 3) fs操作

##### 3.Web Server
 1) 支持get,post请求
 2) express.router 路由控制
 3)ejs模板

##启动服务：
```
node index.js watch 3000
```

##启动爬虫：
```
访问http://localhost:4000
```

##登录
```
访问http://localhost:3000 or http://localhost:3000/login
```
