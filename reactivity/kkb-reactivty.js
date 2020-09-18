//  利用 proxy 监听一个 对象后， 数据的获取， 会触发get函数
// obj。name 收集依赖

// const { triggerRef, ref } = require("vue")

let targetMap = new WeakMap()
let effectStack =[] // 储存effect
function track (target,key){
    // 初始化
    const effect = effectStack[effectStack.length-1]
    if(effect){
        // 需要收集
        let depMap = targetMap.get(target)
        if(depMap === undefined){
            depMap = new Map()
            targetMap.set(target,depMap)
        }
        
        let dep = depMap.get(key)
        if(dep === undefined){
            dep = new Set()
            depMap.set(key,dep)
        }
        // 完成了 初始化
        // 下面进行收集
        // 双向缓存
        if(!dep.has(effect)){
            dep.add(effect) // 把effect放在dep里面
            effect.deps.push(dep)
        }
    }
}

function trigger(target,key,info){
    let depMap = targetMap.get(target)
    if(depMap === undefined){
        return // 没有effect 副作用
    }
    const  effects = new Set()
    const computeds = new Set() // computed 是一个特殊的effect
    if(key){
        let deps = depMap.get(key)
        deps.forEach( effect=>{
            if(effects.computed){
                computeds.add(effect)
            } else {
                effects.add(effect)
            }
        })
    }

    effects.forEach(effect => effect())
    computeds.forEach(computed => computed())
}

const baseHandler = {
    // get 和 set ， 还有删除，是否存在等
    get(target,key){
        const ret = target[key] // 实际中用 Reflect.get(target,key)
        // @todo 收集依赖 到全局的map
        track(target,key)
        return ret // tyPeof ret === 'object' ? reactive(ret): ret
    },
    set(target,key,val){
        const info = {oldValue:target[key],newBalue:val}
        target[key] = val // Reflect.set
        trigger(target,key, info)
        // trigger(target,key, info)
    }
}

function reactive(target){
    // 数据劫持获取
    const observed = new Proxy(target, baseHandler)
    return observed
}

// 便于维护
function effect(fn,options={}){
    //  只考虑执行的逻辑
    let e  = createReactiveEffect(fn,options)
    if(!options.lazy){
        e()
    }
    return e
}
function createReactiveEffect(fn,options){
    const effect = function effect(...args){
        return run(effect,fn,args)
    }
    effect.deps = []
    effect.computed = options.computed
    effect.lazy = options.lazy
    return effect
}

// 调度
function run (effect, fn ,args) {
    if(effectStack.indexOf(effect) === -1){
        try{
            effectStack.push(effect)
            return fn(...args)
        } finally{
            effectStack.pop()
        }
    }
}

function computed(fn){
    const runner = effect(fn, {computed: true, lazy: true})
    console.log(runner);
    return {
        effect: runner,
        get value(){
            return runner()
        }
    }
}