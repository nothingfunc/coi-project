# 草原项目

## 源码目录说明
  前端采用angular 1.x的框架，其中：
  1. src目录是放的源码，是mvc的结构： 
  2. 前端的路由放在routers/routers.js； 
  3. 模版放在templates中，通过template/template.js来引入；（简单的文字改动在这里修改）
  4. 控制器放在controllers中； 
  5. ajax请求放在serverive/api.js。 
  6. 前端开发的时候用的是模拟数据，写在test/apis.json。


## 开发和打包说明
  先安装nodejs

    # 开发环境安装
    npm install fis3 -gd
    git clone https://github.com/nothingfunc/coi-project.git
    cd coi-project
    npm install
    
    # 开发环境自动编译
    fis3 release -w
    # 开发环境开启模拟服务器，在test/apis.json可以修改数据
    fis3 server start -p 8080 --type node
    
    # 开发完成后，执行命令将会会对源码进行压缩合并，并打包到../dist目录，
    fis3 release deploy
