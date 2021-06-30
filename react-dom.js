import { TAG_ROOT } from './constants'
import { scheduleRoot } from './scheduler'
const ReactDOM = {
    render
}

/**
 * 把一个元素 渲染到容器
 */
function render(element, container) { // container == root 真是dom
    let rootFiber = {
        tag: TAG_ROOT, //每个fiber 都有一个tag  标识 元素的类型
        stateNode: container, // 一般情况下如果这个元素是一个原生节点，stateNode指向真实dom元素
        //props.children  是一个数组 里面放的是react 元素 虚拟dom  后面在递归阶段 会 根据react 递归创建 fiber
        props: { children: [element] } //当前filer 的children 属性是将要渲染的元素 在当前fiber 内还不是filer  
    }
    scheduleRoot(rootFiber)
}

export default ReactDOM