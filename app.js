const Koa = require('koa');
const kwm = require('kwm');

const compiler = require('.')()

const app = new Koa();

app.use(kwm(compiler))

// response

app.use(async ctx => {
  ctx.body = ctx.state.webpackStats.compilation.assets;
});

app.listen(3000);
