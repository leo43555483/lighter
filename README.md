 # we 图片画廊博客

简介：私人图片画廊博客

## 环境依赖
1.nodejs:v8.1.2;  

2.express: ~4.15.2;  

3.mongoose: ^4.11.13;

## 开发进度  

*  功能:  
     * 通过/upload/login/进行后台登录（session拦截）;
     * /upload/loged/ 后台上传图片页面;  
     * mongod对图片信息及作者持久化;  
     * 首页响应式动态加载图片;

#### 目录结构描述
```
├──Schema                   // mongoose 模型
├── bin                     // node启动入口
├── common/setting.js       
├── db/mongoose
│    ├── dbMode             //数据库模型
│    ├── db.config.js       
│    ├── modelMethod.js     //mongoose方法
│    ├── mongoose.js
├── middlerware             // 路由中间件
│    ├── index              //首页路由方法
│    ├── login              //后台登录页面方法
│    ├── uload              //后台上传页面方法
│    ├── createThumbs.js
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
