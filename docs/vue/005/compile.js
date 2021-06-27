var html = '<div :class="c" class="demo" v-if="isShow"><span v-for="item in sz">{{item}}</span></div>';

// 正则

// [a-zA-Z_][\w\-\.]匹配所有大小写字母，下划线开头的字符, 双反斜线为了防止字符串转义丢失
// 匹配以字母下划线开头的，加上字母数字横线和点的字符集合（* 后半部分可以出现0次或多次）
// 目的是为了匹配 v-if, div, c.name, cool123, _name 这类的字符
const ncname = '[a-zA-Z_][\\w\\-\\.]*';

const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
  /"([^"]*)"+/.source,
  /'([^']*)'+/.source,
  /([^\s"'=<>`]+)/.source
]

// /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 1. 先说 \s*，\s*的作用是先吃尽所有空白符（空白、换行、tab等等）
// 2. [^\s"'<>\/=]+ 取排除字符组之外的字符作为 “属性名”，这就是捕获 属性名 的过程,+ 匹配一次或多次
// 3. (?:\s*(=)\s* ，?: 指的是非捕获组。这段意思是说 = 号前后可以有空格或其他空白字符。
// 4. 属性值支持三种格式 "xxx" ，'xxx' ，和xxx  ，"([^"]*)" 是匹配 两个"之内任何不是"的字符，同理'([^']*)'也一样
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)

// 匹配  div:name 的情况
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'

// 最终拼接的正则表达式 startTagOpen =  /^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/
// <_div> ，<div.plus>，<my-div> <div:subdiv>
const startTagOpen = new RegExp('^<' + qnameCapture)

// 匹配任意空白字符，然后  /> 或者 >
const startTagClose = /^\s*(\/?)>/

// 匹配尾标签，例如 </div>, 得到 div
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

// makeAttrsMap 是将 attrs 转换成 map 格式的一个方法。
function makeAttrsMap (attrs) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
      map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// getAndRemoveAttr 函数，用来从 el 的 attrsMap 属性或是 attrsList 属性中取出 name 对应值。
function getAndRemoveAtrr(el, name) {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = al.attrList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break;
      }
    }
  }
  return val
}

function parseHTML () {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        parseEndTag(endTagMatch[1])
        continue
      }
      if (html.match(startTagOpen)) {
        const startTagMatch = parseStartTag()
        const element = {
          type: 1,
          tag: startTagMatch.tagName,
          lowerCasedTag: startTagMatch.tagName.toLocaleLowerCase(),
          attrList: startTagMatch.attrs,
          attrsMap: makeAttrsMap(startTagMatch.attrs),
          parent: currentParent,
          children: []
        }

        processIf(element);
        processFor(element);

        if (!root) {
          root = element
        }

        if (currentParent) {
          currentParent.children.push(element)
        }

        stack.push(element)

        currentParent = element

        continue;
      }
    } else {
      text = html.substring(0, textEnd) // 截取标签之间的内容
      advance(textEnd)
      let expression;
      if (expression = parseText(text)) {
        // 解析 vue 表达式 {{ item }}
        currentParent.children.push({
          type: 2,
          text,
          expression
        })
      } else {
        // 普通文本
        currentParent.children.push({
          type: 3,
          text
        })
      }
      continue;
    }
  }
}



// 匹配起始标签
function parseStartTag () {
  const start = html.match(startTagOpen)
  console.log(start)

  if (start) {
    const match = {
      tagName: start[1], // ?: 的作用，能匹配到 start[1] = div, start[0] = <div
      attrs: [],
      start: index
    }
    advance(start[0].length) // 向前移动 '<div' 四个字符

    let end, attr

    // 只要还没匹配到开始结束标签以及能够匹配到属性值，就一直匹配
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      advance(attr[0].length)
      // 往数组里添加解析到的属性值
      match.attrs.push({
        name: attr[1],
        value: attr[3]
      });
    }

    if (end) {
      match.unarySlash = end[1] // 是不是闭合标签 /> end[1] = '' | '/'
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}

// 举例：<div>hello,{{name}}.</div>
// 最终得到 tokens。tokens = ['hello,', _s(name), '.'];
// 最终通过 join 返回表达式。'hello' + _s(name) + '.';
function parseText (text) {

  // 如果 text 不包含 {{}} 则为普通文本，直接返回即可
  if (!defaultTagRE.test(text)) return;

  const tokens = [];

  let lastIndex = defaultTagRE.lastIndex = 0
  let match, index

  while ((match = defaultTagRE.exec(text))) {
    index = match.index

    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }

    const exp = match[1].trim()
    tokens.push(`_s(${exp})`)
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }

  return tokens.join('+')
}

// 截取字符串
function advance (n) {
  index += n
  html = html.substring(n)
}

//  parseEndTag 来解析尾标签，它会从 stack 栈中取出最近的跟自己标签名一致的那个元素，将 currentParent 指向那个元素，并将该元素之前的元素都从 stack 中出栈。
function parseEndTag (tagName) {
  let pos;
  for (pos = stack.length - 1; pos >= 0; pos--) {
    if (stack[pos].lowerCasedTag === tagName.toLocaleLowerCase()) {
      break;
    }
  }

  if (pos >= 0) {
    stack.length = pos;
    currentParent = stack[pos]
  }
}

function processFor (el) {
  let exp;
  if ((exp = getAndRemoveAtrr(el, 'v-for'))) {
    // 解析 v-for 的内容  例如 v-for="(item) in sz"
    const inMatch = exp.match(forAliasRE)
    el.for = inMatch[2].trim() // for 的对象
    el.alias = inMatch[1].trim() // 循环的参数，别称
  }
}

function processIf (el) {
  const exp = getAndRemoveAtrr(el, 'v-if')
  if (exp) {
    el.if = exp;
    if (!el.ifConditions) {
      el.ifConditions = []
    }
    el.ifConditions.push({
      exp: exp, // 条件表达式
      block: el
    })
  }
  
}

let index = 0 // 起始下标从 0 开始
const stack = [] // 维护一个 stack 栈来保存已经解析好的标签
let currentParent // currentParent 变量用来存放当前标签的父标签节点的引用
let root // root 变量用来指向根标签节点。
parseStartTag()