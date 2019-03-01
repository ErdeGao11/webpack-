const argv=require("yargs-parser")(process.argv.slice(2));//获取到当前的node环境
const _mode=argv.mode || "development";//获取当前的模式
const _mergeConfig =require(`./config/webpack_.${_mode}.js`)//根据模式引用不同的配置文件，在业务繁杂的情况下，分开管理不同环境的执行内容
const merge=require("webpack-merge");//切割配置文件，可以让一个文件分成几个，方便开发和管理
const glob =require("glob");//node的glob模块允许你使用 *等符号, 来写一个glob规则,像在shell里一样,获取匹配对应规则的文件.
const files=glob.sync("./src/web/views/**/*.entry.js");//glob.sync同步获得文件
const HtmlWebpackPlugin=require('html-webpack-plugin');//插件的基本作用就是生成html文件。原理很简单：
const {join} =require('path');//方便路径管理，join是拼接路径的方法
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//解析css
const HtmlAfterWebpack=require("./config/HtmlAfterWebpackPlugin");//引入写的插件
let _entry={};
let _plugins=[];
for(let item  of files){
  if(/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g.test(item) ==true){
    const entryKey =RegExp.$1;
    _entry[entryKey]=item;
    const [dist,template]=entryKey.split("-");
    _plugins.push(new HtmlWebpackPlugin({
      filename: `../views/${dist}/pages/${template}.html`,//目标文件
      template: `src/web/views/${dist}/pages/${template}.html`,//源文件
      chunks: [entryKey],//指允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中。在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk；
      inject:false
    }))
  }
}
let webpackconfig={
  entry:_entry,//打包入口，需要打包的文件
  module: {
      rules: [{
          test: /\.css$/,
          use: [{
                  loader: MiniCssExtractPlugin.loader,
              },
              "css-loader"
          ]
      }]
  },
  // module: {
  //     rules: [{
  //         test: /\.css$/,
  //         loader: 'style-loader!css-loader'
  //     }, ],
  // },
  output:{
    path:join(__dirname,'./dist/assets'),//打包之后的输出路径
    publicPath:"/",//静态文件前面会补上这个公共路由
    filename:'scripts/[name].bundule.js'//打包之后的文件名
  },
  plugins:[
    new MiniCssExtractPlugin({
        filename: "styles/[name].css",
        chunkFilename: "styles/[id].css"
    }),
    ..._plugins,//插件的使用就是new 插件名,
    new HtmlAfterWebpack(),//因为这里使用了html-webpack-plugin注入到webpack的生命周期所以必须在他后面执行！
  ]
} 
module.exports=merge(webpackconfig,_mergeConfig);