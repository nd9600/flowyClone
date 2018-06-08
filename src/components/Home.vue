<template>
    <div id="home">
        <header id="header">
            <div>
                <h1 style="display: inline-block;">Home</h1>
                <input
                    ref="newTaskInput"
                    v-model="newTask"
                    @keyup.enter="addTask"
                    class="inputBox"
                    placeholder="New task"
                >

                <!-- there are two divs so that the visibility switches are on a new line -->
                <div>
                    <div
                        @mouseover="showClearButton = true"
                        @mouseleave="showClearButton = false"
                        class="searchBoxWrapper"
                    >
                        <input
                            ref="searchInput"
                            placeholder="Search"
                            v-model="computedSearchTerm"
                            type="search"
                            class="inputBox"
                        >
                        <a
                            v-if="showClearButton"
                            @click="computedSearchTerm = ''"
                            class="clearButton"
                        >x</a>
                    </div>
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
            </div>

            <div id="topRight">
                <settings></settings>
                <br/>
                <clipboard></clipboard>
            </div>
        </header>
        <section>
            <tasks
                :outerTask="null"
                :taskIDs="filteredTaskIDs"
            >
            </tasks>

            <p v-if="visibility !== 'completed'"
               style="color: #999;"
            >{{numberOfTasksRemaining}} {{numberOfTasksRemaining | pluralise}} left</p>

        </section>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";
    import Settings from "./Settings.vue";
    import Clipboard from "./Clipboard.vue";

    export default {
        name: "home",
        data() {
            return {
                newTask: "",
                visibility: "all",
                showClearButton: false
            }
        },
        components: {
            Settings,
            Clipboard
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID",
                "changeSearchTerm",
                "setTask",
                "addTaskToRoot",
                "changeShowInnerTasks"
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
                "tasksAsArray",
                "taskByID",
                "rootTasks",
                "tagsInTasks",
                "taskStorageUID",
                "searchTerm",
            ]),

            //can filter tasks by a search term or visibility
            filteredTasks() {
                let currentSearchTerm = this.searchTerm && this.searchTerm.trim();

                let shouldShowInnerTasks = (this.visibility === "all" && currentSearchTerm.length === 0);
                if (shouldShowInnerTasks) {
                    return this.rootTasks;
                }

                if (!currentSearchTerm) {
                    return task.filters[this.visibility](this.tasksAsArray);
                }

                let tasksContainingSearchTerm = this.tasksAsArray.filter(task =>
                    task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
                );
                return task.filters[this.visibility](tasksContainingSearchTerm);

            },

            filteredTaskIDs() {
                return this.filteredTasks.map(task => task.id);
            },

            numberOfTasksRemaining() {
                if (this.visibility === "active") {
                    return this.filteredTaskIDs.length;
                }
                let vm = this;
                function recursiveNumberOfActiveTasks(taskID) {
                    let thisTask = vm.taskByID(taskID);
                    let thisTaskIsActive = thisTask.complete ? 0 : 1;

                    let activeInnerTasks = thisTask.tasks
                        .map(innerTaskID => recursiveNumberOfActiveTasks(innerTaskID));
                    let summedActiveInnerTasks = activeInnerTasks.reduce((acc, val) => acc + val, 0);

                    return thisTaskIsActive + summedActiveInnerTasks;

                }

                let mappedNumberOfActiveTasks = this.filteredTaskIDs.map(taskID => recursiveNumberOfActiveTasks(taskID));
                return mappedNumberOfActiveTasks.reduce((acc, val) => acc + val, 0);
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
            },
        },
        filters: {
            pluralise(n) {
                return n === 1 ? "item" : "items";
            }
        },
        watch: {
            visibility() {
                let shouldShowInnerTasks = (this.visibility === "all" && this.searchTerm.trim().length === 0);
                this.changeShowInnerTasks(shouldShowInnerTasks);
            },
            searchTerm() {
                let shouldShowInnerTasks = (this.visibility === "all" && this.searchTerm.trim().length === 0);
                this.changeShowInnerTasks(shouldShowInnerTasks);
            },
        },
        mounted: function() {

            window.addEventListener('keyup', (event) => {
                let focusedElementIsntInput = document.activeElement.tagName.toLowerCase() !== "input";

                switch (event.keyCode) {

                    //focus on the new task field when n is pressed and you're not in an input
                    case 78:
                        if (focusedElementIsntInput) {
                            this.$refs.newTaskInput.focus();
                        }
                        break;

                    //focus on the search field when s is pressed
                    case 83:
                        if (focusedElementIsntInput) {
                            this.$refs.searchInput.focus();
                        }
                        break;
                }
            });
        }
    }
</script>

<style>
    :root {
        --link-colour: #42b983;
        --separator-colour: #d1d1d1;
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
        display: inline-flex;
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

    #header {
        display: flex;
        justify-content: space-between;
    }

    #topRight {
        max-width: 250px;
        opacity: 0.1;
    }
    #topRight:hover {
        opacity: 1;
    }

    .selected {
        color: #982c61;
    }

    .separator {
        background-color: var(--separator-colour);
        height: 1px;
        margin: 10px 0 10px 0;
    }

    .normalText {
        font-weight: 100;
    }
</style>
