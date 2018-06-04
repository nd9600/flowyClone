<template>
    <div id="home">
        <h1>Home</h1>
        <input
            class="inputBox"
            placeholder="New task"
            v-model="newTask"
            @keyup.enter="addTask"
        >
        <div
            @mouseover="showClearButton = true"
            @mouseleave="showClearButton = false"
            class="searchBoxWrapper"
        >
            <input
                type="search"
                class="inputBox"
                placeholder="Search"
                v-model="computedSearchTerm"
            >
            <a
                v-if="showClearButton"
                @click="computedSearchTerm = ''"
                class="clearButton"
            >x</a>
        </div>

        <span>
            <a
                @click="visibility = 'all'"
                :class="{ selected: visibility === 'all' }"
            >all</a>
            <a
                @click="visibility = 'active'"
                :class="{ selected: visibility === 'active' }"
            >active</a>
            <a
                @click="visibility = 'completed'"
                :class="{ selected: visibility === 'completed' }"
            >completed</a>
        </span>

        <tags
            :tags="tags"
        >
        </tags>

        <div class="separator"></div>

        <tasks
            :outerTask="null"
            :taskIDs="filteredTaskIDs"
        >
        </tasks>

        <p v-if="visibility !== 'completed'"
           style="color: #999;"
        >{{numberOfTasksRemaining}} {{numberOfTasksRemaining | pluralise}} left</p>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "home",
        data() {
            return {
                newTask: "",
                visibility: "all",
                showClearButton: false
            }
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID",
                "changeSearchTerm",
                "setTask",
                "addTaskToRoot"
            ]),

            addTask() {
                let value = this.newTask && this.newTask.trim();
                if (!value) {
                    return;
                }

                this.incrementTaskStorageUID();
                let newTaskObject = new task.Task({
                    id: this.taskStorageUID,
                    content: value
                });
                this.setTask(newTaskObject);
                this.addTaskToRoot(newTaskObject["id"]);
                this.newTask = "";
            }
        },
        computed: {
            ...mapGetters([
                "taskByID",
                "rootTasks",
                "tagsInTasks",
                "taskStorageUID",
                "searchTerm",
            ]),

            //can filter tasks by a search term or visibility
            filteredTasks() {
                let currentSearchTerm = this.searchTerm && this.searchTerm.trim();
                if (!currentSearchTerm) {
                    return task.filters[this.visibility](this.rootTasks);
                }

                let tasksContainingSearchTerm = this.rootTasks.filter(task =>
                    task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
                );
                return task.filters[this.visibility](tasksContainingSearchTerm);

            },

            filteredTaskIDs() {
                return this.filteredTasks.map(task => task.id);
            },

            numberOfTasksRemaining() {
                let vm = this;
                function recursiveNumber(taskID) {
                    let thisTask = vm.taskByID(taskID);
                    return thisTask.tasks.reduce((previousNumberActive, newTaskID) => {
                        return previousNumberActive + recursiveNumber(newTaskID);
                    }, ! thisTask.complete ? 1 : 0)
                }

                return this.filteredTasks.map(task => {
                    recursiveNumber(task.id)
                }).reduce((acc, val) => acc + val);
                // return this.filteredTasks.filter(task => !task.complete).length;
            },

            tags() {
                return this.tagsInTasks(this.filteredTaskIDs);
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
    :root {
        --link-colour: #42b983;
    }

    a {
        color: var(--link-colour);
    }

    button:focus, button:hover, input[type="submit"]:focus, input[type="submit"]:hover, input[type="reset"]:focus, input[type="reset"]:hover, input[type="button"]:focus, input[type="button"]:hover {
        background-color: var(--link-colour);
        border-color: var(--link-colour);
        color: #fff;
    }

    input[type="search"]::-webkit-search-cancel-button {
        display: none
    }

    .searchBoxWrapper {
        display: flex;
        align-items: center;
    }

    .inputBox {
        display: block;
        margin: 10px 0 10px 0;
        padding: 10px;
        min-width: 200px;
    }

    .clearButton {
        margin-left: -25px;
    }

    #home {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
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
