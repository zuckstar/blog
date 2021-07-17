const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser') // 将模块文本解析成 AST 语法树
// 遍历语法树，并找出符合规则的节点
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

// 读取文件
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8')
  

  const ast = parser.parse(body, {
    sourceType: 'module' // 表示解析的模块是 ES 模块
  })

  // 用来收集路径依赖
  const deps = {}
  // traverse 第一个参数是 ast，第二个参数是配置选项
  traverse(ast, {
    ImportDeclaration({node}){
      const dirname = path.dirname(file)
      // 拼接目录名和文件名
      const abspath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = abspath

    }
  })

  // 将初入的 ast 转化成第三个参数传入的模块类型
  const {code} = babel.transformFromAst(ast, null, {
    presets:["@babel/preset-env"]
  })

  const moduleInfo = {file, deps, code}

  // 返回了当前文件的模块，包含文件路径，模块依赖，转换成 es5 的代码
  return moduleInfo
}

const parseModules = (file) => {
  const entry = getModuleInfo(file)
  const temp = [entry]
  const depsGraph = {}

  for(let i = 0; i< temp.length; i++) {
    const deps = temp[i].deps
    if(deps) {
      for(const key in deps) {
        if(deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]))
        }
      }
    }
  }

  temp.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })

  // 把解析的模块用 depsGraph 来存储
  return depsGraph
}


const bundle = (file) =>{
  const depsGraph = JSON.stringify(parseModules(file))
  return `(function (graph) {
      function require(file) {
          function absRequire(relPath) {
              return require(graph[file].deps[relPath])
          }
          var exports = {}
          ;(function (require,exports,code) {
              eval(code)
          })(absRequire,exports,graph[file].code)
          return exports
      }
      require('${file}')
  })(${depsGraph})`
}

// 处理两个关键字：exports 和 require
// (function (graph) {
//   function require(file) {
//     function absRequire(relPath) {
//       // 递归调用 require
//       return require(graph[file].deps[relPath])
//     }

//     var exports = {}

//     ;(function (require,exports,code) {
//       eval(code)
//     })(absRequire,exports,graph[file].code)
//   }
//   require(file)
// })(depsGraph)

const content = bundle('./src/index.js')

fs.mkdir('./dist', ()=>{})
fs.writeFileSync('./dist/bundle.js', content)
