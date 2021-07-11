const axios = config => {
  if (config.error) {
    return Promise.reject({
      error: "error in axios"
    })
  } else {
    return Promise.resolve({
      ...config,
      result: config.result
    })
  }
}


// 初始化拦截器对象
axios.interceptors = {
  request: [],
  response: []
}

// 注册请求拦截器
axios.useRequestInterceptor = (resolved, rejected) => {
  axios.interceptors.request.push({resolved, rejected})
}

// 注册响应拦截器
axios.useResponseInterceptor = (resolved, rejected) => {
  axios.interceptors.response.push({resolved, rejected})
}

// 运行拦截器的方法
axios.run = config => {
  const chain = [
    {
      resolved: axios,
      rejected: undefined
    }
  ]

  // 把请求拦截器往数组头部推
  axios.interceptors.request.forEach(interceptor => {
    chain.unshift(interceptor)
  })

  // 把响应拦截器往数组尾部推
  axios.interceptors.response.forEach(interceptor => {
    chain.push(interceptor)
  })

  // 把配置项也包装成 promise
  let promise = Promise.resolve(config)

  while (chain.length) {
    const { resolved, rejected } = chain.shift()
    promise = promise.then(resolved, rejected)
  }

  return promise

}

// 使用请求拦截器
axios.useRequestInterceptor(config => {
  // 进行处理 ...

  // 返回值
  return {
    ...config,
    extraParams1: 'extraParams1'
  }
})
  
axios.useRequestInterceptor(config => {
  // 返回值
  return {
    ...config,
    extraParams2: 'extraParams2'
  }
})

// 使用响应拦截器
axios.useResponseInterceptor(
  resp => {
    const {
      extraParams1,
      extraParams2,
      message
    } = resp
    return `${extraParams1}${extraParams2}${message}`
  },
  error => {
    console.log("error", error)
  }
)

  // 成功调用
  // ;(async function() {
  //   const result = await axios.run({
  //     message: "message1"
  //   });
  //   console.log("result1: ", result);
  // })();

  // 失败调用
  ;(async function() {
  const result = await axios.run({
    error: true
  });
  console.log("result3: ", result);
})();