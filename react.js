import { ELEMENT_TEXT } from './constants'
import { Update } from './UpdateQuenu'
import { scheduleRoot, useReducer } from './scheduler'
/**
 * 创建元素虚拟dom 的方法
 * @param {*} tag 
 * @param {*} props 
 * @param  {...any} children 
 */

function createElement(type, config, ...children) {
    return {
        type: type,
        props: {
            ...config,
            children: children.map(child => { // 兼容处理  如果是element 元素  就返回自己 如果 是字符串  就自己封装一个文本元素对象
                return typeof child === 'object' ? child : {
                    type: ELEMENT_TEXT,
                    props: { text: child, children: [] }
                }
            })
        }
    }
}

class Component {
    constructor(props) {
        this.props = props
            // this.UpdataQuenu = new UpdataQuenu()
    }
    setState(playload) {
        let update = new Update(playload)
            //UpdataQuenu 其实是放在此类组件对应的fiber节点上 internalFiber
        this.internalFiber.updateQueue.enqueueUpdate(update)
        scheduleRoot() // 从根节点开始调度
    }
}
Component.prototype.isReactComponent = {}
const React = {
    createElement,
    Component,
    useReducer
}
export default React