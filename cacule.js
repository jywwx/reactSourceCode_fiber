function findMaxDuplicateChar(str) {
    if (str.length == 1) { return str; }
    let charObj = {};
    for (let i = 0; i < str.length; i++) {
        if (!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        } else {
            charObj[str.charAt(i)] += 1;
        }
    }
    let maxChar = '',
        maxValue = 1;
    for (var k in charObj) {
        if (charObj[k] >= maxValue) {
            maxChar = k;
            maxValue = charObj[k];
        }
    }
    return maxChar;
}
module.exports = findMaxDuplicateChar;



function fundMaxNumForStr(str) {
    if (str.length === 1) {
        return str
    }
    let chartObj = {}
    for (let i = 0; i < str.length; i++) {
        if (!chartObj[i]) {
            chartObj[i] = 1
        } else {
            chartObj[i] += 1
        }
    }
    let maxStr = '',
        maxNum = 1
    for (let ket in chartObj) {
        if (chartObj[k] > maxNum) {
            maxStr = k
            maxNum = chartObj[k]
        }
    }
    return { max: maxStr, num: maxNum }
}


function  maxAndMin(arr) {
    return {
        max: Math.max.apply(null, arr.join(',').split(',')),
        min: Math.min.apply(null, arr.join(',').split(','))
    }
}

// 清空数组 
arr.length = 0
arr.splice(0, arr.length)
arr = [] // 严格模式下 只是将[] 赋值给了 arr 但是原有的数组 如果没有引用 只是等待垃圾回收器 等待回收



//保留几位小数
Number.toFixed(2)

const array = ['1', 2, '3', '4', '5', '67']
array.sort(function() {
    return Math.random() - 0.5
})







export { fundMaxNumForStr }