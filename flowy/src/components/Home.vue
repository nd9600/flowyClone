<template>
    <div id="home">
        <h1>Home</h1>
        <tags
            id="tags"
            :tags="getTags"
        >
        </tags>
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
            }
        },
        methods: {
            loadTasks: function() {
                this.tasks.push(... [
                    new task.Task("t1", "", "", ["test"]),
                    new task.Task("t2", "", "", ["test"]),
                    new task.Task("t3", "", "", ["test3"])
                ]);
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
    #home {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin: 30px 0 0 30px;
    }

    a {
        color: #42b983;
    }
</style>
