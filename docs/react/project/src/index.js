import React from './react';
import ReactDOM from './react-dom';



// 案例1： 纯 jsx 元素类型
// // 创建元素对象
// var li1 = React.createElement('li', {}, 'First');
// var li2 = React.createElement('li', {}, 'Second');
// var li3 = React.createElement('li', { style: {backgroundColor: 'red'}}, 'Third');
// var ul = React.createElement('ul', { className: 'list' }, li1, li2, li3);


// // 渲染对象
// ReactDOM.render(
//   ul,
//   document.getElementById('root')
// );

// 案例2: Component 组件类型
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0,
      needUpdate: false
    }
  }

  componentWillMount () {
    console.log('执行 componentWillMount')
  }
  
  componentDidMount () {
    console.log('执行 componentDidMount')
    setInterval(() => {
      this.setState({number: this.state.number + 1})
    }, 1000);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.needUpdate !== this.state.needUpdate
  }

  render () {
    let p = React.createElement('p', { style: { color: 'red' } }, this.state.number)
    let button = React.createElement('button', {}, '+')
    return React.createElement('div', {id:'counter'},p,button)
    
    // 文本
    // return this.state.number
  }
}

let element = React.createElement(Counter, {name:"计时器"})

ReactDOM.render(
  element,
  document.getElementById('root')
);
