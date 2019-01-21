# get-umi-webpack-compiler

react ssr 在dev环境下，需要获得webpack-compiler.

## Usages

```
const compiler = require('get-umi-webpack-compiler')(entry, dir)
```

示例

```
const compiler = require('.')({
  'app1':"@/pages/index.tsx"
}, process.cwd())
```

- entry是自定的入口，一般用于自定义的服务器端组件编译
- @是别名，指定src目录。
- 如果没dir参数，默认是process.cwd()

## Examples
下面是一个koa + dev + hot middleware的例子。

```
const Koa = require('koa');
const kwm = require('kwm');

const app = new Koa();

// get webpack-compiler from an umi project
const compiler = require('get-umi-webpack-compiler')()

// dev + hot middleware
app.use(kwm(compiler))

// response
app.use(async ctx => {
  ctx.body = Object.keys(ctx.state.webpackStats.compilation.assets);
});

app.listen(3000);
```

返回ctx.state.webpackStats.compilation.assets结果

```
["static/yay.44dd3333.jpg","layouts__index.chunk.css","layouts__index.async.js","p__index.chunk.css","p__index.async.js","umi.css","umi.js"]
```

## Test

```
const compiler = require('.')()
// 测试webpack执行情况
compiler.run((err, stats) => {/* ...处理结果 */
  if (err) console.dir(err)

  console.dir(stats)
})

```
