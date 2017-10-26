 # we 图片画廊博客

简介：私人图片画廊博客

## 环境依赖
1.nodejs:v8.1.2;  

2.express: ~4.15.2;  

3.mongoose: ^4.11.13;

## 开发进度  

*  前端:  

     *  index页实现向下滚动加载图片功能;
     *  load页实现AJAX拖拽上传图片功能;  
     
*  服务端:  

     * 首页缩略图片加载api及后台分页功能;

#### 目录结构描述
```
├── Readme.md                   // help
├── app                         // 应用
├── config                      // 配置
│   ├── default.json
│   ├── dev.json                // 开发环境
│   ├── experiment.json         // 实验
│   ├── index.js                // 配置控制
│   ├── local.json              // 本地
│   ├── production.json         // 生产环境
│   └── test.json               // 测试环境
├── data
├── doc                         // 文档
├── environment
├── gulpfile.js
├── locales
├── logger-service.js           // 启动日志配置
├── node_modules
├── package.json
├── app-service.js              // 启动应用配置
├── static                      // web静态资源加载
│   └── initjson
│   	└── config.js 		// 提供给前端的配置
├── test
├── test-service.js
└── tools
```
