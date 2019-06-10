# hall-data-h5

> 这是数据中心管理后台前端框架。它只包含了 Element UI & axios & iconfont & lint，这些搭建后台必要的东西。这个项目是基于 `vue-cli` 进行构建。

# 独自搭建，自我练习

> 搭建一套多环境、多子项目简易后台

## Build Setup

```bash
# 克隆项目
git clone http://gitlab.fz.stevegame.red/plat/hall-data-h5.git

# 进入项目目录
cd hall-data-h5

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9527](http://localhost:9527)

## 目录结构

```
  ├───dist                // 项目打包文件
  │   ├── static          // 静态文件(js、css、img)
  │   └── index.html      // 入口文件模板
  ├── node_modules        // 项目依赖文件(npm install后生成)
  ├── public              
  │   ├── favicon.ico     // 网址上方的标题的小图标
  │   └── index.html      // 入口文件模板
  ├── src                 // 项目的主文件
  │   ├── api             // 公用api方法文件
  │   ├── assets          // 静态资源文件
  │   ├── ├── icon        // icon字体依赖文件
  │   ├── components      // 公用可复用组件
  │   ├── utils           // 公用可复用方法
  │   ├── router          // 路由
  │   ├── views           // 页面组件
  │   ├── App.vue         // app入口文件
  │   └── main.js         // js入口文件
  ├── env.development     // 开发环境配置文件
  ├── env.production      // 生产环境配置文件
  ├── env.testing         // 测试环境配置文件
  ├── vue.config.js       // 配置文件入口
  ├── babel.config.js     // babel配置文件入口
  ├── eslintrc.js         // Eslint配置文件
  ├── cypress.json        // cypress单元测试配置文件
  ├── jest.config.js      // jest单元测试配置文件
  └── package.json        // 打包依赖配置文件
```

## 发布

```bash
# 构建测试环境
npm run build:test

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
