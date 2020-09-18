const { ref, effect ,watchEffect} = require('@vue/reactivity')
// 独立的包可以放在u任何框架
let count = ref(1)
effect(()=>{
    // 副作用
    console.log('count',count.value);
})
setInterval(()=>{
    count.value++
},1000)