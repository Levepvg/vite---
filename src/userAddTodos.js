import { reactive,computed} from 'vue'
function userAddTodo() {
    let state = reactive({
        todos: [{
                name: '吃饭',
                done: false
            },
            {
                name: '睡觉',
                done: false
            }
        ],
        val: ''
    })
    let total = computed(() => state.todos.length)

    function addTodo() {
       if(state.val.trim().length > 0){
        state.todos.push({
            done: false,
            name: state.val
        })
        state.val = ''
        console.log(state.todos);
       }
    }
    function changeTodos(e){
        console.log(e);
        console.log(state.val);
    }
    return {
        state,
        total,
        addTodo,
        changeTodos
    }
}
export  default userAddTodo;