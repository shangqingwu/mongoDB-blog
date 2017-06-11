//用户相关路由
let express = require("express");
//调用Router方法，可以得到一个路由中间件的实例；
let router = express.Router();
let {User} = require("../model");//默认找index页面；
let {checkNotLogin,checkLogin} = require("../auth");//中间件要在路由中使用判断，所以要在路由中，将此中间件auth引进来；
let multer = require("multer");//在user中用这个中间件，别的用body-parser就可以了；
let uploads = multer({dest:"public/uploads"});

//中间件可以放在路径和回调之间,可以加多个，直接在逗号,后面写就行；；
//用户注册：/user/signup 这是一个后缀
router.get("/signup",checkNotLogin,function (req,res) {
    res.render("user/signup",{title:"用户注册"});
});
router.post("/signup",checkNotLogin,uploads.single("avatar"),function (req,res) {
    let user = req.body;//请求体对象（username，password，email）
    // console.log(user);
    user.avatar = `/uploads/${req.file.filename}`;//给user增加属性avatar，但是数据库骨架模型中没有这个字段，添加的时候会被忽略，所以要在模型中将avatar字段添加上；
    User.create(user,function (err,docs) {
        if(err){
            req.flash("error","用户注册失败"); //类型，内容；
            res.redirect("back");
        }else{
            req.flash("success","用户注册成功");
            res.redirect("/user/signin");
        }
    })
});
router.get("/signin",checkNotLogin,function (req,res) {
    res.render("user/signin",{title:"用户登录"});
});
//用户登录
router.post("/signin",checkNotLogin,function (req,res) {
    let user = req.body;//得到 用户提交的登录表单；
    // console.log(user);
    User.findOne(user,function (err,docs) {
        if (err){  //登录查询时失败；
            req.flash("error","操作数据库失败");
            res.redirect("back");//数据库连不上了的话，就会报错；
        }else {
            if (docs){
                req.flash("success","用户登录成功");
                //向会话对象req.session中写入属性：user= doc
                req.session.user = docs;
                res.redirect("/"); //匹配成功，返回首页；
            }else {
                req.flash("error","用户名或密码不正确");
                res.redirect("back"); // 没有匹配到该用户；
            }
        }
    })
});
router.get("/signout",checkLogin,function (req,res) {
    req.session.user = null;
    res.redirect("/user/signin");
});
module.exports = router;

















