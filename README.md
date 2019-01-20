# get-umi-webpack-compiler

react ssr 在dev环境下，需要获得webpack-compiler.

## Usages

```
const compiler = require('get-umi-webpack-compiler')(dir)
```

如果没dir参数，默认是process.cwd()

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

## Test

```
const compiler = require('.')()
// 测试webpack执行情况
compiler.run((err, stats) => {/* ...处理结果 */
  if (err) console.dir(err)

  console.dir(stats)
})

```
