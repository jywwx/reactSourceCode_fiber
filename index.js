import React from './react';
import ReactDOM from './react-dom';
// 类组件设计开发
// userState 是一个语法糖 是基于useReducer实现的  先看userReducer
// class ClassCounter extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       number:0
//     }
//   }
//   onClick = () => {
//     this.setState (state=> ({number:state.number+1}))
//   }
//   render() {
//     return (
//       <div id="counter">
//         <span>{this.state.number}</span>
//         <button onClick={this.onClick.bind(this)}>加1</button>
//       </div>
//     )
//   }
// }
// // console.log(new ClassCounter(),"<ClassCounter />")
function FunctionCounter () {
  const [countState,dispatch] = React.useReducer(reducer,{count:0})
  return (
    <div id="counter">
      <span>{countState.count}</span>
      <button onClick={() => {dispatch({type:'ADD'})}}>加1</button>
    </div>
  )
}

function reducer(state,action) {
  switch (action.type) {
    case 'ADD':
      return { count:state.count +1}
    default:
      return state  
  }
}
ReactDOM.render(<FunctionCounter  name="计数器"/>, document.getElementById('root'))

// console.log(React.createElement)
// let style = {border:'3px solid red',margin:'5px'}
// let element1 = (
//   <div id="A1" style ={style}>
//     A1
//     <div id="B1" style ={style}>
//       B1
//       <div id="C1" style ={style}>
//       C1
//       </div>
//       <div id="C2" style ={style}>
//       C2
//       </div>
//     </div>
//     <div id='B2' style ={style}>B2</div>
//   </div>
// )
// ReactDOM.render(
//   element1,
//   document.getElementById('root')
// );

// let render2 = document.getElementById('render2')
// render2.addEventListener('click',()=>{
//   let element2 = (
//     <div id="A1" style ={style}>
//       A1-new
//       <div id="B1" style ={style}>
//       B2-new
//         <div id="C1" style ={style}>
//         C1
//         </div>
//         <div id="C2" style ={style}>
//         C2
//         </div>
//       </div>
//       <div id='B2' style ={style}>B2-new</div>
//       <div id='B3' style ={style}>B3</div>
//     </div>
//   )
//   ReactDOM.render(
//     element2,
//     document.getElementById('root')
//   );
  
// })



// let render3 = document.getElementById('render3')
// render3.addEventListener('click',()=>{
//   let element3 = (
//     <div id="A1-new2" style ={style}>
//       A1-new2
//       <div id="B1-new2" style ={style}>
//         B1-new2
//         <div id="C1-new2" style ={style}>
//         C1-new2
//         </div>
//         <div id="C2-new2" style ={style}>
//         C2-new2
//         </div>
//       </div>
//       <div id='B2-new2' style ={style}>B2-new</div>
//     </div>
//   )
//   ReactDOM.render(
//     element3,
//     document.getElementById('root')
//   );
// })