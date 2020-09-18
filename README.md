编译是的优化，  Vue3 最大的特点

vite ， 按需加载
现代浏览器都支持es的 import 
import xx from ‘./a.js’ 浏览器会发出一个网络请求

vite 拦截这个请求， 去做vue 相关的编译，解析等， 实现了按需加载的能力 
不能打包

dev 秒开 ， build 走的是rollup

<!-- vite 原理 作用
    1 vue3配套的工具 ， 下一代的脚手架工具
    2 写一个vite ， 完整的掌握了vue3 代码编译的流程（使用层面）
        如果想做ssr， node解析。vue -->
        vue2 也有静态标记， 只能标记全量的静态
            v-if 内部的静态节点
            <p id='xxx'> {{ name }}</p>
            这个节点，只有child是动态， vue也会全量diff
            vue3 只diff children