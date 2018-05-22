<template>
    <div id="home">
        <h1>Home</h1>
            <input 
                class="inputBox" 
                placeholder="New task"
                v-model="newTask"
                @keyup.enter="addTaskMethod"
            >
            <input
                class="inputBox"
                placeholder="Search"
                v-model="computedSearchTerm"
            >
        <div>
            <a 
                @click="visibility = 'all';"
                :class="{ selected: visibility == 'all' }"
            >all</a>
            <a 
                @click="visibility = 'active';"
                :class="{ selected: visibility == 'active' }"
            >active</a>
            <a 
                @click="visibility = 'completed';"
                :class="{ selected: visibility == 'completed' }"
            >completed</a>
        </div>
        <tags
            :tags="getTags"
        >
        </tags>
        <hr />
        <tasks
            :tasks="getFilteredTasks"
        >
        </tasks>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";

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
            ...mapMutations([
                "initialiseTasks",
                "addTask",
                "incrementTaskStorageUID",
                "changeSearchTerm"
            ]),

            addTaskMethod(event) {
                let value = this.newTask && this.newTask.trim();
                if (! value) {
                    return;
                }

                this.incrementTaskStorageUID();
                this.addTask(new task.Task({
                    id: this.taskStorageUID,
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
                "tasks",
                "taskStorageUID",
                "searchTerm"
            ]),

            //can filter tasks by a search term or visibiliity
            getFilteredTasks() {
                let searchTerm = this.searchTerm && this.searchTerm.trim();
                if (! searchTerm) {
                    return filters[this.visibility](this.tasks);
                }
                let tasksContainingSearchTerm = this.tasks.filter(task => 
                    task.content.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                );
                return filters[this.visibility](tasksContainingSearchTerm);
                
            },
            getTags() {
                return this.tasks.map(t => t.tags).flatten().unique();
            },

            computedSearchTerm: {
                get () {
                    return this.searchTerm;
                },
                set (value) {
                    this.changeSearchTerm(value);
                }
            }
        },
        created() {
            this.initialiseTasks();
        }
    }
</script>

<style>
    a {
        color: #42b983;
    }

    .inputBox {
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

    .selected {
        color: #982c61;
    }
</style>
