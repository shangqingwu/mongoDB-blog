//文章相关路由
let express = require("express");
let {checkNotLogin,checkLogin} = require("../auth");//中间件要在路由中使用判断，所以要在路由中，将此中间件auth引进来；
let {Article} = require("../model");
let router = express.Router();
router.get("/add",checkLogin,function (req,res) {
   res.render("article/add",{title:"发表文章",article:{}});
});
router.post("/add",checkLogin,function (req,res) {
   let article = req.body;
   article.user = req.session.user._id;
   Article.create(article,function (err,docs) {
      if(err){
         req.flash("error",err);
         res.redirect("back");
      }else {
         req.flash("success","成功发表文章");
         res.redirect("/");
      }
   })
});
router.get("/detail/:_id",function (req,res) {
   let _id = req.params._id;
   Article.findById(_id,function (err,article) {
      if (err){
         req.flash("error",err);
         req.redirect("back");
      }else {
         res.render("article/detail",{title:"文章详情",article})
      }
   })
});
router.get("/delete/:_id",function (req,res) {
   let _id = req.params._id;
   Article.remove({_id},function (err,result) {
      if(err){
         req.flash("error",err);
         res.redirect("back");
      }else {
         req.flash("success","成功删除文章");
         res.redirect("/")
      }
   })
});
router.get("/update/:_id",function (req,res) {
   let _id = req.params._id;
   Article.findById(_id,function (err,article) {
      res.render("article/add",{title:"更新文章",article});
   })
});
router.post("/update/:_id",function (req,res) {
   let _id = req.params._id;
   Article.update({_id},req.body,function (err,article) {
      if(err){
         req.flash("error",err);
         res.redirect("back");
      }else {
         req.flash("success","文章更新成功");
         res.redirect("/article/detail/"+_id);
      }
   })
});

//article回显老的数据；

module.exports = router;




