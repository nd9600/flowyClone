<template>
    <div id="home">
        <h1>Home</h1>
        <tags
            id="tags"
            :tags="getTags"
        >
        </tags>
        <input 
            class="newTask" 
            placeholder="New task"
            v-model="newTask"
            @keyup.enter="addTask"
        >
        <tasks
            id="tasks"
            :tasks="tasks"
        >
        </tasks>
    </div>
</template>

<script>
    import * as task from "../base/task.js";

    export default {
        name: "home",
        data() {
            return {
                tasks: [],
                newTask: "",
            }
        },
        methods: {
            loadTasks() {
                this.tasks.push(... [
                    new task.Task("t1", false, "", "", ["test"]),
                    new task.Task("t2", false, "", "", ["test"]),
                    new task.Task("t3", false, "", "", ["test3"])
                ]);
            },
            addTask(event) {
                var value = this.newTask && this.newTask.trim()
                if (!value) {
                    return
                }
                this.tasks.push(new task.Task(value, false, "", "", []));
                this.newTask = "";
            }
        },
        computed: {
            getTags() {
                return this.tasks.map(t => t.tags).flatten();
            }
        },
        created() {
            this.loadTasks();
        }
    }
</script>

<style>
    a {
        color: #42b983;
    }

    .newTask {
        display: block;
        margin: 10px 0 10px 0;
    }

    #home {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin: 30px 0 0 30px;
    }
</style>
