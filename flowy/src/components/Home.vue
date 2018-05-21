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

    // localStorage persistence
    var STORAGE_KEY = 'tasks-flowyClone'
    var taskStorage = {
        fetch: function () {
            var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
                tasks.forEach(function (task, index) {
                task.id = index
            })
            taskStorage.uid = tasks.length
            return tasks
        },
        save: function (tasks) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        }
    }

    export default {
        name: "home",
        data() {
            return {
                tasks: taskStorage.fetch(),
                newTask: "",
            }
        },
        methods: {
            loadTasks() {
                this.tasks = taskStorage.fetch();
            },
            addTask(event) {
                var value = this.newTask && this.newTask.trim()
                if (!value) {
                    return
                }
                this.tasks.push(new task.Task({
                    id: taskStorage.uid++,
                    content: value, 
                    complete: false, 
                    author: "", 
                    link: "", 
                    tags: ["test", "test2"]
                }));
                this.newTask = "";
            }
        },
        computed: {
            getTags() {
                return this.tasks.map(t => t.tags).flatten();
            }
        },

        // watch tasks change for localStorage persistence
        watch: {
            tasks: {
                handler: function (tasks) {
                    taskStorage.save(tasks)
                },
                deep: true
            }
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
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin: 30px 0 0 30px;
    }
</style>
