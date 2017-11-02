 # we 图片画廊博客

简介：私人图片画廊博客

## 环境依赖
1.nodejs:v8.1.2;  

2.express: ~4.15.2;  

3.mongoose: ^4.11.13;

## 开发进度  

*  前端:  
     * index页实现向下滚动加载图片功能;
     * load页实现AJAX拖拽上传图片功能;  
     
*  服务端:  

     * 首页缩略图片加载api及后台分页功能;

#### 目录结构描述
```
├──Schema                   // mongoose 模型
├── bin                     // node启动入口
├── db  
├── middlerware             // 中间件
├── node_modules
├── public                  // web静态资源加载
│    ├── font
│    ├── images
│    ├── javascripts	       
├── routes                  // 路由件
├── temp/uploadImg          
├── .project                    
├── README.md
├── app.js                   // 启动配置
├── package-lock.json
└── package.json             // 依赖配置
```
