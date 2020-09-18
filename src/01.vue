<template>
<div>
    <h1>{{ count }}</h1>
    <button @click="add">clcik</button>
</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import {
    red
}
from 'vue'
import func from '../vue-temp/vue-editor-bridge'
export default {
    setup() {
        let count = ref(1)

        function add() {
            count.value++
        }
        return {
            count,
            add
        }
    }
}

// export default {
//     name: 'App',
//     components: {
//         HelloWorld
//     }
// }
</script>
