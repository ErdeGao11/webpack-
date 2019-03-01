import Koa from 'koa';
const app = new Koa();//创建实例
import render from 'koa-swig';//引入swig模板；
import path from 'path';//路由
import co from 'co';//基于生成器的控制流对nodejs和浏览器的好处，让您以一种友好的方式编写非阻塞代码。
import serve from 'koa-static';//不装找不到静态资源
import log4js from 'log4js';//输出日志
import config from './config/index';
app.context.render = co.wrap(render({// koa v2.x 需要加入co模块
  root: path.join(config.viewDir),//配置swig的路由；
  autoescape: true,
  cache: config.cacheset, // disable, set to false
  // varControls: ["[[", "]]"],//修改koa-swig的引用,因为和vue冲突
  ext: 'html',
  writeBody: false// koa v2.x要加入
}));
app.use(serve(config.staticDir));
log4js.configure({//配置输出日志
  appenders: { cheese: { type: 'file', filename: 'logs/cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');//实装
console.dir(process.env.NODE_ENV);//配合package的设置可以看到我们在里面存入的值
require('./middlewares/errorHandle').error(app,logger)
require('./controllers/index')(app);//注入我们的路由机制
app.listen(3000,()=>{console.log('🍎Sever start')});