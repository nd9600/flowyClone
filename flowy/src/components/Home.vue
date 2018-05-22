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
            :tags="tags"
        >
        </tags>
        <hr />
        <tasks
            :tasks="getFilteredTasks"
        >
        </tasks>

        <br />

        <p class="smallText">{{tasksAsJSON}}</p>
        <p class="smallText">{{this.taskStorageUID}}</p>
        <!-- <textarea
            class="inputBox" 
            placeholder="Replace tasks with JSON"
            @blur="replaceTasksWithJSON"
        ></textarea> -->
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";
    import {STORAGE_KEY} from "../store/store.js";
    import {getTagsInTasks} from "../base/useful_functions.js";

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
                visibility: "all",
                jsonInput: ""
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
                }));
                this.newTask = "";
            },

            replaceTasksWithJSON(event) {
                let value = event.target.value && event.target.value.trim();
                if (! value) {
                    return;
                }
                let splitValue = value.split("\n").filter(str => str.length > 0);
                let newTasks = splitValue[0];
                let newUID = splitValue[1];
                localStorage.setItem(STORAGE_KEY + "-tasks", newTasks);
                localStorage.setItem(STORAGE_KEY + "-taskStorageUID", newUID);

                this.initialiseTasks();
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
            tags() {
                return getTagsInTasks(this.tasks);
            },

            computedSearchTerm: {
                get () {
                    return this.searchTerm;
                },
                set (value) {
                    this.changeSearchTerm(value);
                }
            },

            tasksAsJSON() {
                console.log(JSON.stringify(this.tasks));
                return JSON.stringify(this.tasks);
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

    .smallText {
        color: #c3c3c3;
        font-size: 1rem;
    }
</style>
