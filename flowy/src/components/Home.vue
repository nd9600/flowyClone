<template>
    <div id="home">
        <h1>Home</h1>
            <input 
                class="newTask" 
                placeholder="New task"
                v-model="newTask"
                @keyup.enter="addTask"
            >
        <div>
            <a @click="visibility = 'all';">all</a>
            <a @click="visibility = 'active';">active</a>
            <a @click="visibility = 'completed';">completed</a>
        </div>
        <tags
            id="tags"
            :tags="getTags"
        >
        </tags>
        <hr />
        <tasks
            id="tasks"
            :tasks="getFilteredTasks"
        >
        </tasks>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters} from "vuex";

    let filters = {
        all: function (tasks) {
            return tasks
        },
        active: function (tasks) {
            return tasks.filter(function (task) {
                return ! task.complete
            });
        },
        completed: function (tasks) {
            return tasks.filter(function (task) {
                return task.complete
            });
        }
    };

    export default {
        name: "home",
        data() {
            return {
                newTask: "",
                visibility: "all"
            }
        },
        methods: {
            addTask(event) {
                let value = this.newTask && this.newTask.trim();
                if (! value) {
                    return;
                }
                this.$store.commit("addTask", new task.Task({
                    id: this.$store.state.taskStorageUID++,
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
            ...mapGetters([
                "getTasks",
                "loadTasksFromStorage"
            ]),
            getFilteredTasks() {
                return filters[this.visibility](this.getTasks);
            },
            getTags() {
                return this.getTasks.map(t => t.tags).flatten().unique();
            }
        },
        beforeCreate() {
            this.$store.commit('initialiseTasks');
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
        padding: 10px;
    }

    #home {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin: 30px 0 0 30px;
    }
</style>
