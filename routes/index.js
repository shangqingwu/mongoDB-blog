let express = require("express");
//调用Router方法，可以得到一个路由中间件的实例；
let router = express.Router();
let {Article, User} = require("../model");
//当客户端通过get请求方式访问 / 路由的时候，会交由对应的函数来处理；
router.get("/", function (req, res) {
    let keyword = req.query.keyword;
    let pageNum = isNaN(req.query.pageNum) ? 1 : parseInt(req.query.pageNum);
    let pageSize = isNaN(req.query.pageSize) ? 3 : parseInt(req.query.pageSize);
    let query = {};
    query["$or"] = [{title: new RegExp(keyword)}, {content: new RegExp(keyword)}];
    //populate("user")把user属性从字符串转为对象
    Article.count(query, function (err, count) {
        Article.find(query).sort({createAt: -1}).skip((pageNum - 1) * pageSize).limit(pageSize).populate("user").exec(function (err, articles) {
            // console.log(articles);
            res.render("index", {
                title: "首页",
                articles,
                keyword,
                pageNum,
                pageSize,
                totalPages: Math.ceil(count / pageSize)
            }); // 相对于views根路径来进行查找文件，不能写绝对路径，只能写相对路径，后缀不用写，他会自己找；-> 路由是相对路径，相对
        });
    });
});
// module 模块       model 模型 ，操作数据库用模型；
module.exports = router;//必须导出，否则在别的文件导入的话，会得到一个空对象；











