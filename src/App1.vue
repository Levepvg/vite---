<template>
<div>
    {{ x  }}  {{  y }}
    <h1>早上好</h1>  
    {{ val }}
    <input @change="changeTodos" @keyup.enter="addTodo" type="text" v-model="state.val">
    <ul>
        {{todos}}
        <li v-for="(todo,index) in state.todos" :key="index">
            {{ todo.name}}
        </li>
    </ul>
    <div>
        total ： {{ total}}
    </div>
</div>
</template>

<script>
// import {
//     reactive,
//     computed
// } from 'vue'
import userAddTodo from './userAddTodos'
import useMouse from './userMouse'
// reactive 复杂的数据结构编程响应式
// ref 是简单的数据结构
export default {
    setup() {
        let {
            state,
            total,
            addTodo,
            changeTodos
        } = userAddTodo()
        let {
            x,
            y
        } = useMouse()
        return {
            state,
            total,
            addTodo,
            changeTodos,
            x,
            y
        }
    }
}
</script>
