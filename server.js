let express = require("express");
let app = express();

//设置模板引擎 html；
let path = require("path");
app.set("view engine", "html");
//指定模板的存放根目录；
app.set("views", path.resolve("views"));
//指定对于html类型的模板使用ejs来进行渲染；
app.engine("html", require("ejs").__express);

//此静态文件中间件会拦截到客户端对于静态文件的请求；-> 如bootstrap.css会先到node_modules找到对应的文件
app.use(express.static(path.resolve("node_modules")));//把node_modules作为静态文件的根目录；
app.use(express.static(path.resolve("public"))); //中间件是同步的，有两个静态文件的根目录，当要找文件的时候，会先去node_modules目录下找，找到了就返回，不再往下走了，找不到就再去public下面找；

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let session = require("express-session");//会话中间件；
let MongoStore = require('connect-mongo')(session);
// 在使用了此会话中间件之后，会在请求对象上增加req.session属性；
app.use(session({
    resave: true,
    secret: "kim",
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000 //指定cookie的过期时间；
    },
    store: new MongoStore({
        url: require('./config').dbUrl
    })
}));

let flash = require("connect-flash");//一定要放在session下面，因为此中间件是需要依赖session的；
//flash是一个函数，有两个参数，传两个参数表示赋值 req.flash(type,msg)，传一个参数表示获取值 req.flash(type)；
// req.flash(type,msg)可以调用多次；存放的是数组，取出来的值也是数组；
//req.flash(type)；flash功能：读完一次后立马会立马清空数据；但是实际意义是存在于session中的，所以要用flash；
app.use(flash());


//中间件不要在路由后面用，这样路由就看不见了，必须在前面用；
let index = require("./routes/index");//中间件，必须use一下 ；
let user = require("./routes/user");//中间件，必须use一下 ；
let article = require("./routes/article");//中间件，必须use一下 ；
app.use(function (req, res, next) {  //use中间件中放的是公有的属性和方法，所有路由都可以用；
    // 真正渲染模板的是res.locals；
    res.locals.user = req.session.user;
    res.locals.success = req.flash("success").toString();//取出来的值是数组，因为要后面要进行判断，而且要把内容显示在页面中，所以要toString一下，转为字符串；
    res.locals.error = req.flash("error").toString();
    res.locals.keyword = "";
    next();
});
// 可以直接写index，还可以加一个路径，当访问的路径是以这个路径开头的时候，才调用这个中间件；
app.use("/", index);
//当客户端
app.use("/user", user);
app.use("/article", article);


app.listen(8080);






































