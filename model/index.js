let mongoose = require("mongoose");
mongoose.Promise = Promise;
//连接数据库
mongoose.connect(require("../config").dbUrl);
//定义用户集合的骨架模型，规定了用户集合中的文档的属性和类型；
let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar:String
});
//定义用户模型；
let User = mongoose.model("User",UserSchema);
//把用户模型挂载到导出对象上，别的文件require会得到一个User对象；
exports.User = User;

let ObjectId = mongoose.Schema.Types.ObjectId;
let ArticleSchema = new mongoose.Schema({
   //ref：引用的是哪个集合的主键；
    title:String,
    content:String,
    createAt:{type:Date,default:Date.now},
    user:{type:ObjectId,ref:"User"}
});
let Article = mongoose.model("Article",ArticleSchema);
exports.Article = Article;











