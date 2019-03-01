const CopyPlugin=require('copy-webpack-plugin');//用来复制文件的插件
const {join}=require('path');
module.exports={
    plugins:[
        new CopyPlugin([{
            from:join(__dirname,"../","/src/web/views/common/pages/layout.html"),
            to:join(__dirname,"../","/dist/views/common/layout.html")
        }]),
        new CopyPlugin([{
            from:join(__dirname,"../","/src/web/components"),
            to:join(__dirname,"../","/dist/components")
        }],{//额外的配置
            copyUnmodified:true,//如果模板没有变，调试阶段就不传递
            ignore:["*.js","*.css",".DS_Store"]//忽略到不复制的东西。
        })
    ]
}