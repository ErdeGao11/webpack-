//1.何时才能拦截最后生成的swig
//2.如何分清swig文件对应的js和css
const pluginName = "HtmlAfterWebpackPlugin";
const assetsHelp=(data)=>{
    console.log("🍠",data)
    let js=[];
    let css=[];
    const dir={
        js:item=>`<script src="${item}"></script>`,
        css:item=>`<link rel="stylesheet" href="${item}">`
    }
    for(let jsitem of data.js){
        js.push(dir.js(jsitem));
    }
    for(let cssitem of data.css){
        css.push(dir.css(cssitem))
    }
    return {js,css}
}
class HtmlAfterWebpackPlugin {
    apply(compiler){//这里的apply不是js的，而是webpack的，compiler是webpack的实例。
        compiler.hooks.compilation.tap(pluginName,compilation=>{//将这个方法挂在到webpack实例上
            //挂在到htmlWebpackPluginAfterHtmlProcessing的生命周期上面
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName,htmlPluginData=>{
                console.log(htmlPluginData.assets);//他保留了编译过程中的数据。
                let _html=htmlPluginData.html;
                const result=assetsHelp(htmlPluginData.assets);
                console.log("🌞",result.css.join(""))
                _html=_html.replace(/..\/components/g,"../../../components");
                _html=_html.replace(/pages:/g,"../../common/");
                _html=_html.replace("<!-- injectjs -->",result.js.join(""));//join() 方法用于把数组中的所有元素放入一个字符串。
                _html=_html.replace("<!-- injectscss -->",result.css.join(""));
                htmlPluginData.html=_html;
            })
        });
    }
}
module.exports = HtmlAfterWebpackPlugin;
// webpack的生命周期，hooks.xxx，比如当前的是run就是webpack执行的时候就运行，
// 比如我们想让他在html-webpack-plugin插件执行之后执行，我们就去看html-webpack-plugin的源码
//找到他创建的生命周期compilation.hooks.htmlWebpackPluginAfterHtmlProcessing = new AsyncSeriesWaterfallHook(['pluginArgs']);