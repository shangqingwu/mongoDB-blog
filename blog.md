#### 新建项目
1. 初始化：npm init -y
2. 安装依赖的模块：
npm install body-parser  cookie-parser debug ejs express morgan serve-favicon express-session connect-mongo mongoose connect-flash multer async bootstrap -S
#### 创建服务
开服务：也可以写 mongod --dbpath = ./data 

1. express + mongodb
2. 跑通路由：新建index.js、user.js、article.js ，实现 / 、/user/signup 等路由；
public目录下放静态文件

拿不到请求体的内容原因：
1. input没写name属性；
2. 没引body-parse；

index.js  给query赋值一个数组，里面是正则验证，当find的时候，在数据库中匹配query中的正则，符合其中一条就放到数组中返回，再进行数组排序等操作；

session是存到数据库的内存中；
持久化session：将session存到数据库中，防止重启服务器时，数据丢失；








