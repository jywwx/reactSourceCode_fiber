export const ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT")

export const TAG_ROOT = Symbol.for("TAG_ROOT")
export const TAG_HOST = Symbol.for("TAG_HOST")
export const TAG_TEXT = Symbol.for("ELEMENT_TEXT")

//这个是类组件
export const TAG_CLASS = Symbol.for("TAG_CLASS")
    // 这是个函数组件
export const TAG_FUNCTION_COMPONENT = Symbol.for("TAG_FUNCTION_COMPONENT")
    // 插入节点 
export const PLACEMENT = Symbol.for("PLACEMENT")
    //更新节点
export const UPDATE = Symbol.for("UPDATE")
    //删除节点
export const DELETION = Symbol.for("DELETION")