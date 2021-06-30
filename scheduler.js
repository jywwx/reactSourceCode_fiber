/**
 * 从更节点 开始渲染调度
 * 两个阶段 
 * diff （Reconiliation） 阶段 对比新旧虚拟dom  进行增量  更新 或创建 render 阶段 这个阶段比较花时间 对任务 拆分 以一个虚拟dom 、
 * 节点为最先任务执行片段 此阶段可以暂停 原来 的递归深度遍历 不能暂停中断  生成结果effect list  知道那些节点更新了 那些节点新增了 那些节点删除了
 * 1. 根据 虚拟dom 生成fiber 数 2 收集effect List
 * commit 阶段 进行dom 更新或者创建 该过程不能中断 中断会导致 ui 不连续
 */
import { ELEMENT_TEXT, TAG_TEXT, TAG_ROOT, TAG_HOST, PLACEMENT, DELETION, UPDATE, TAG_CLASS, TAG_FUNCTION_COMPONENT } from './constants'
import { Update, UpdateQueue } from './UpdateQuenu'
import { setProps } from './unit'
let nextUnitOfWork = null // 下一个fiber
let workInProgressRoot = null //Rootfiber 的根
let currentRoot = null //渲染成功之后 当前根rootRlber


let workInProgressFiber = null // 正在工作中的fiber
let hookIndex = 0 // hooks 索引

let deletion = []; // 删除的节点 不放在effect list  所以要剔除 单独执行

function scheduleRoot(rootFiber) { // {tag:TAG_ROOT,stateNode:container,props:{children:[element]}}
    if (currentRoot && currentRoot.alternate) { // 第二次之后的渲染
        workInProgressRoot = currentRoot.alternate
        if (rootFiber) {
            workInProgressRoot.props = rootFiber.props
        }
        workInProgressRoot.alternate = currentRoot
        console.log('第二次以上更新', workInProgressRoot)
    } else if (currentRoot) { // 如果currentRoot有值  说明至少渲染过一次  
        if (rootFiber) {
            rootFiber.alternate = currentRoot
            workInProgressRoot = rootFiber
        } else {
            workInProgressRoot = {
                ...currentRoot,
                alternate: currentRoot
            }
        }
        console.log('第一次更新', workInProgressRoot)
    } else { // 如果是第一次渲染
        console.log('初始化渲染', rootFiber)
        workInProgressRoot = rootFiber
    }

    nextUnitOfWork = workInProgressRoot

    workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null

    requestIdleCallback(workLoop, { timeout: 500 })
}

function workLoop(deadLine) { // 工作循环
    let shouldYield = false // 是否让出时间片 或者控制权
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadLine.timeRemaining() < 1 // 执行完一个任务 没有剩余时间 交还 控制权给浏览器
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot()
    } else {
        requestIdleCallback(workLoop, { timeout: 500 }) //  还有任务 再次 请求浏览器的空闲回调
    }
}
//**commit 阶段 */
function commitRoot() {
    deletion.forEach(commitWork) // 执行effect list  之前把该删除的元素 删掉
    let currentFiber = workInProgressRoot.firstEffect
    while (currentFiber) {
        commitWork(currentFiber)
        currentFiber = currentFiber.nextEffect
    }
    deletion.length = 0 // 提交之后 清空deletion数组
    currentRoot = workInProgressRoot // 把当前渲染成功的根fiber，赋给currentFiber
    workInProgressRoot = null
}

function commitWork(currentFiber) {
    if (!currentFiber) {
        return
    }
    let returnFiber = currentFiber.return
    while (returnFiber.tag !== TAG_HOST && returnFiber.tag !== TAG_ROOT && returnFiber.tag !== TAG_TEXT) {
        returnFiber = returnFiber.return;
    }
    let returnDOM = returnFiber.stateNode
    if (currentFiber.effectTag === PLACEMENT) {
        // 如果要挂在 的不是dom 节点 比如类组件 Fiber 一直往下找儿子 太子 直到找一个真是dom 节点为止
        if (currentFiber.tag === TAG_CLASS) {
            return
        }
        let nextFiber = currentFiber
        while (nextFiber.tag !== TAG_HOST && nextFiber.tag !== TAG_TEXT) {
            nextFiber = currentFiber.child
        }
        returnDOM.appendChild(nextFiber.stateNode)
    } else if (currentFiber.effectTag === DELETION) {
        return commitDeletion(currentFiber, returnDOM)
    } else if (currentFiber.effectTag === UPDATE) {
        if (currentFiber.type === ELEMENT_TEXT) {
            if (currentFiber.alternate.props.text !== currentFiber.props.text) {
                currentFiber.stateNode.textContent = currentFiber.props.text
            }
        } else {
            updatDOM(currentFiber.stateNode, currentFiber.alternate.props, currentFiber.props)
        }
    }
    currentFiber.effectTag = null
}

function commitDeletion(currentFiber, domReturn) {
    if (currentFiber.tag === TAG_HOST || currentFiber.tag === TAG_TEXT) {
        domReturn.removeChild(currentFiber.stateNode)
    } else {
        commitDeletion(currentFiber.child, domReturn)
    }
}

function performUnitOfWork(currentFiber) {
    beginWork(currentFiber)
    if (currentFiber.child) {
        return currentFiber.child
    }
    while (currentFiber) {
        completeUnitOfWork(currentFiber) // 没有儿子 就让自己完成 看有没有弟弟 有弟弟返回弟弟 
        if (currentFiber.sibling) {
            return currentFiber.sibling
        }
        currentFiber = currentFiber.return //找到父亲  让父亲完成  再找父亲的弟弟
    }
}
// 在完成 fiber 节点的创建 或者 fiber 节点的遍历的时候 要收集effect 组成我们的effect list   收集副作用  effect list 是单链表
function completeUnitOfWork(currentFiber) {
    let returnFiber = currentFiber.return
    if (returnFiber) {
        ////这一段是把自己儿子的effect 链 挂到父亲身上
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = currentFiber.firstEffect
        }
        if (!!currentFiber.lastEffect) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber.firstEffect
            }
            returnFiber.lastEffect = currentFiber.lastEffect
        }
        //////////////////分割线
        // 这是把自己挂到父亲身上
        // 每个effect fiber 有两个属性 firstEffect 指向第一个有副作用的子 effect fiber  lastEffect 指向最后一个 有副作用的 子 effect fiber
        // 中间的用nextEffect 做成一个单链表 firstEffect = 大儿子.nextEffect 二儿子.nextEffect 三儿子  lastEffect
        if (currentFiber.effectTag) { // 自己有副作用
            if (returnFiber) { // A1 
                if (returnFiber.lastEffect) {
                    returnFiber.lastEffect.nextEffect = currentFiber
                } else {
                    returnFiber.firstEffect = currentFiber
                }
                returnFiber.lastEffect = currentFiber
            }
        }
    }
}

/**
 * 开始处理下线
 * 
 * completeUnitOfWork
 * @param {*} fiber 
 */
function beginWork(currentFiber) {
    // 1.创建dom 元素
    // 2. 创建子fiber
    if (currentFiber.tag === TAG_ROOT) { //根节点fiber
        updateHostRoot(currentFiber)
    } else if (currentFiber.tag === TAG_TEXT) { //文本fiber
        updateHostText(currentFiber)
    } else if (currentFiber.tag === TAG_HOST) { //原生domfiber
        updateHost(currentFiber)
    } else if (currentFiber.tag === TAG_CLASS) { // 类组件fiber
        updateClassComponent(currentFiber)
    } else if (currentFiber.tag === TAG_FUNCTION_COMPONENT) { // 函数组件fiber
        updateFunctionComponent(currentFiber)
    }
}

function updateHostRoot(currentFiber) { //处理根节点
    // 先处理自己，如果是一个原生节点，创建真实dom 2. 创建子fiber
    let newChildren = currentFiber.props.children
    reconcilieChildren(currentFiber, newChildren) // 调和子节点 [A1]
}

function updateHostText(currentFiber) { // 创建文本节点
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = createDom(currentFiber)
    }
}

function updateHost(currentFiber) { // 处理原生dom 节点
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = createDom(currentFiber)
    }
    reconcilieChildren(currentFiber, currentFiber.props.children)
}

function updateClassComponent(currentFiber) { // 处理类组件
    if (!currentFiber.stateNode) { //类组件的fiber 的 stateNode  是组件的实例
        currentFiber.stateNode = new currentFiber.type(currentFiber.props)
        currentFiber.stateNode.internalFiber = currentFiber
        currentFiber.updateQueue = new UpdateQueue()
    }
    // 给组件的实例的state 赋值
    currentFiber.stateNode.state = currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state)
    reconcilieChildren(currentFiber, [currentFiber.stateNode.render()])
}

function updateFunctionComponent(currentFiber) { // 处理函数组件
    workInProgressFiber = currentFiber
    hookIndex = 0
    workInProgressFiber.hooks = []
    const newChild = currentFiber.type(currentFiber.props)
    reconcilieChildren(currentFiber, [newChild])
}




function createDom(currentFiber) { // 根据fiber 创建真实的dom
    if (currentFiber.tag === TAG_TEXT) {
        return document.createTextNode(currentFiber.props.text)
    } else if (currentFiber.tag === TAG_HOST) {
        let stateNode = document.createElement(currentFiber.type)
        updatDOM(stateNode, {}, currentFiber.props)
        return stateNode
    }
}

function updatDOM(dom, oldProps, newProps) {
    if (dom && dom.setAttribute)
        setProps(dom, oldProps, newProps)
}

function reconcilieChildren(currentFiber, newChildren) { // 当前fiber  newchild 子节点的虚拟dom  [A1]
    let newChildIndex = 0; // 新子节点的索引
    let prevSibling; // 上一个新的子fiber
    // 如果说currentFiber 有alternate 并且 currentFiber.alternate 有child 属性

    let oldFiber = currentFiber.alternate && currentFiber.alternate.child
    if (oldFiber) oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null
        //遍历我们的子虚拟dom 元素数组 为每个虚拟dom创建fiber
    while (newChildIndex < newChildren.length || oldFiber) {
        let newChild = newChildren[newChildIndex] // 取出虚拟dom 节点 元素节点
        let newFiber; // 新的fiber
        const sameType = oldFiber && newChild && oldFiber.type === newChild.type

        let tag;
        if (newChild && typeof newChild.type === 'function' && newChild.type.prototype.isReactComponent) {
            tag = TAG_CLASS
        } else if (newChild && typeof newChild.type === 'function') {
            tag = TAG_FUNCTION_COMPONENT
        } else if (newChild && newChild.type === ELEMENT_TEXT) {
            tag = TAG_TEXT // 这是一个文本节点
        } else if (newChild && typeof newChild.type === 'string') {
            tag = TAG_HOST // 这是一个原生dom节点
        } // beginWork创建fiber， 在completeUnitOfWork 的时候 收集effect
        if (sameType) { // 说明老fiber 和新的虚拟dom 的类型 一样  可以复用老的dom 节点 更新dom 节点就可以了
            if (oldFiber.alternate) { // 说明至少已经更新过一次
                newFiber = oldFiber.alternate // 如果有上 上次的fiber  就复用对象 而不用 新创建对象 currentFiber.alternate.alternate
                newFiber.props = newChild.props
                newFiber.alternate = oldFiber
                newFiber.effectTag = UPDATE
                newFiber.updateQueue = oldFiber.updateQueue || new UpdateQueue()
                newFiber.nextEffect = null
            } else {
                newFiber = {
                    tag: oldFiber.tag,
                    type: oldFiber.type,
                    props: newChild.props, // 一定要用新的虚拟dom 的props
                    stateNode: oldFiber.stateNode,
                    updateQueue: oldFiber.updateQueue || new UpdateQueue(),
                    return: currentFiber,
                    alternate: oldFiber, //让新fiber 的alternate 指向老的fiber
                    effectTag: UPDATE, // 副作用标识 render 我们会收集副作用 
                    nextEffect: null // effect list 也是一个单链表 
                }
            }
        } else {
            if (newChild) { //看看新的虚拟dom 是不是为null
                newFiber = {
                    tag,
                    type: newChild.type,
                    props: newChild.props,
                    stateNode: null,
                    return: currentFiber,
                    updateQueue: new UpdateQueue(),
                    effectTag: PLACEMENT, // 副作用标识 render 我们会收集副作用 
                    nextEffect: null // effect list 也是一个单链表
                }
            }
            if (oldFiber) {
                oldFiber.effectTag = DELETION
                deletion.push(oldFiber)
            }
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling //oldFiber指针向后移动一次
        }
        // 创建链表  最小的儿子 没有sibling
        if (newFiber) {
            if (newChildIndex === 0) { // 索引为0 第一个儿子  
                currentFiber.child = newFiber
            } else {
                prevSibling.sibling = newFiber
            }
            prevSibling = newFiber
        }
        newChildIndex++
    }

}

function useReducer(reducer, initalValue) {
    let newHook = workInProgressFiber.alternate && workInProgressFiber.alternate.hooks && workInProgressFiber.alternate.hooks[hookIndex]
    if (newHook) {
        // 第二次 或者第二次以后渲染 函数组件
        newHook.state = newHook.updateQueue.forceUpdate(newHook.state)
    } else {
        newHook = {
            state: initalValue,
            updateQueue: new UpdateQueue()
        }
    }
    const dispatch = (action) => {
        let payload = reducer ? new Update(reducer(newHook.state, action)) : action
        newHook.updateQueue.enqueueUpdate(payload)
        scheduleRoot()
    }
    workInProgressFiber.hooks[hookIndex++] = newHook;
    return [newHook.state, dispatch]
}
export { scheduleRoot, useReducer }