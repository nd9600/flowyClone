<template>
    <div id="home">
        <h1>Home</h1>
        <input 
            class="inputBox" 
            placeholder="New task"
            v-model="newTask"
            @keyup.enter="addTask"
        >
        <input
            class="inputBox"
            placeholder="Search"
            v-model="computedSearchTerm"
        >

        <span>
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
        </span>

        <tags
            :tags="tags"
        >
        </tags>

        <div class="separator"></div>

        <tasks
            :tasks="filteredTasks"
        >
        </tasks>

        <p style="color: #999;">{{numberOfTasksRemaining}} {{numberOfTasksRemaining | pluralise}} left</p>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";
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
        props: ["tasks"],
        data() {
            return {
                newTask: "",
                visibility: "all",
            }
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID",
                "changeSearchTerm"
            ]),

            addTask(event) {
                let value = this.newTask && this.newTask.trim();
                if (! value) {
                    return;
                }

                this.incrementTaskStorageUID();
                this.tasks.push(new task.Task({
                    id: this.taskStorageUID,
                    content: value, 
                    complete: false, 
                    author: "", 
                    link: "", 
                }));
                this.newTask = "";
            }
        },
        computed: {
            ...mapGetters([
                "taskStorageUID",
                "searchTerm"
            ]),

            //can filter tasks by a search term or visibiliity
            filteredTasks() {
                let currentSearchTerm = this.searchTerm && this.searchTerm.trim();
                if (! currentSearchTerm) {
                    return filters[this.visibility](this.tasks);
                }
                
                let tasksContainingSearchTerm = this.tasks.filter(task => 
                    task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
                );
                return filters[this.visibility](tasksContainingSearchTerm);
                
            },

            numberOfTasksRemaining() {
                return this.filteredTasks.filter(task => ! task.complete).length;
            },

            tags() {
                return getTagsInTasks(this.tasks);
            },

            computedSearchTerm: {
                get() {
                    return this.searchTerm;
                },
                set(value) {
                    this.changeSearchTerm(value);
                }
            }
        },
        filters: {
            pluralise(n) {
                return n === 1 ? "item" : "items";
            }
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
        min-width: 200px;
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

    .separator {
        background-color: #d1d1d1;
        height: 1px;
        margin: 10px 0 10px 0;
    }
</style>
