class Koa {
  constructor() {
    this.middlewares = []
  }

  use (middleware) {
    this.middlewares.push(middleware)
  }

  start ({ req }) {
    const composed = composeMiddlewares(this.middlewares) // 中间件传入偏函数
    const ctx = { req, res: undefined }
    return composed(ctx) // 传入 ctx 递归执行中间件函数
  }
}

// 组合中间件
function composeMiddlewares (middlewares) {
  return function wrapMiddlewares (ctx) {
    let index = -1
    function dispatch (i) {
      index = i

      const fn = middlewares[i]

      if (!fn) {
        return Promise.resolve()
      }

      return Promise.resolve(fn(ctx, ()=>dispatch(i+1)))
    }

    return dispatch(0)
  }
}

const app = new Koa()


// 最外层的中间件管控全局错误
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(`koa error: ${error.message}`)
  }
})

// 第二层日志中间件
app.use(async (ctx, next) => {
  const { req } = ctx
  console.log(`req is ${JSON.stringify(req)}`);
  await next();
  // next过后已经能拿到第三层写进ctx的数据了
  console.log(`res is ${JSON.stringify(ctx.res)}`);
})

// 第三层，业务逻辑处理中间件
app.use(async (ctx, next) => {
  const { req } = ctx;
  console.log(`calculating the res of ${req}...`);
  const res = {
    code: 200,
    result: `req ${req} success`
  };
  // 写入ctx
  ctx.res = res;
  await next();
});


// 用来测试全局错误中间件
// 注释掉这一个中间件 服务才能正常响应
app.use(async (ctx, next) => {
  throw new Error("oops! error!");
});

// 启动函数
app.start({ req: "ssh" }); // 初始 ctx