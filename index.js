import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import apiRouter from './api';

const app = new Koa();

app.use(json());
app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.use(async (ctx, next) => {
  await next();
  ctx.status = 404;
  ctx.body = { status: 404, message: `Cannot find ${ctx.url}` };
});

app.listen(3005);