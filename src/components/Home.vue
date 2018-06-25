<template>
    <div id="home">
        <header style="display: inline-block;">
            <h1>Home</h1>
            <input
                ref="newTaskInput"
                v-model="newTask"
                @keyup.enter="addTaskFromInput"
                type="search"
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
                        v-model="computedSearchTerm"
                        type="search"
                        class="inputBox"
                        placeholder="Search"
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
        </header>
        <div id="topRight">
            <div id="topRightButtons">
                <button @click="setCurrentTopRightTab('settings')" class="topRightButton"
                >Settings
                </button>
                <button 
                    v-if="this.clipboard !== null"
                    @click="setCurrentTopRightTab('clipboard')" 
                    class="topRightButton"
                >Clipboard
                </button>
                <button 
                    v-if="this.storageMethod === 'firebase'"
                    @click="setCurrentTopRightTab('firebase')" 
                    class="topRightButton"
                >Firebase
                </button>
            </div>
            <div>
                <component :is="currentTopRightTab"></component>
            </div>
        </div>
        <section>
            <tasks
                :outerTaskID="null"
                :taskIDs="filteredTaskIDs"
            >
            </tasks>

            <p v-if="visibility !== 'completed'"
               style="color: #999;"
            >{{numberOfTasksRemaining}} {{numberOfTasksRemaining | pluralise}} left</p>
        </section>
        <div
            @click="addTask()"
            class="bottomRightButton"
        >+</div>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapGetters, mapMutations} from "vuex";
    import Settings from "./Settings.vue";
    import Clipboard from "./Clipboard.vue";
    import Firebase from "./Firebase.vue";
    import * as task from "../base/task.js";

    export default {
        name: "home",
        data() {
            return {
                topRightComponent: "settings",
                newTask: "",
                visibility: "all",
                showClearButton: false
            }
        },
        components: {
            Settings,
            Clipboard,
            Firebase
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID",
                "changeSearchTerm",
                "setTask",
                "addTaskToRoot",
                "changeShowInnerTasks",
                "setCurrentTopRightTab"
            ]),

            addTaskFromInput() {
                let value = this.newTask && this.newTask.trim();
                if (!value) {
                    return;
                }
                this.addTask(value);
            },
            addTask(value = "") {
                this.incrementTaskStorageUID();
                let newTask = new task.TaskObject({
                    id: this.taskStorageUID,
                    content: value,
                    parent: "root"
                });
                this.setTask(newTask);
                this.addTaskToRoot(newTask.id);
                this.newTask = "";

                Vue.nextTick(() => {
                    document.getElementById(`task-${newTask.id}-input`).focus();
                });
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
                "clipboard",
                "currentTopRightTab",
                "storageMethod"
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
                let focusedElementIsntInput = (document.activeElement.tagName.toLowerCase() !== "input") && (document.activeElement.tagName.toLowerCase() !== "textarea");

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
    #home {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #topRight {
        position: absolute;
        top: 1%;
        right: 1%;
        min-width: 275px;
        max-width: 275px;
        padding: 0 0 10px 10px;
        border: 1px solid var(--separator-colour);

        opacity: 0.1;
    }
    #topRight:hover {
        opacity: 1;
    }
    #topRightButtons {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .topRightButton {
        padding: 6px 10px;
        margin-bottom: -1px;
        margin-right: -1px;

        border: 1px solid #ccc;
        cursor: pointer;
        background: #f0f0f0;
        color: #34495e;;
    }

    .bottomRightButton {
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        bottom: 25%;
        right: 22%;
        width: 30px;
        height: 30px;
        border-radius:100%;
        padding: 10px;
        cursor: pointer;

        background-color: #F44336;
        background: #F44336;
        border: none;
        outline: none;
        color: #FFF;
        opacity: 0.5;
        font-size: 36px;
        box-shadow: 6px 6px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    .bottomRightButton:hover {
        opacity: 1;
        box-shadow: 6px 6px 6px rgba(0,0,0,0.32), 0 3px 6px rgba(0,0,0,0.46);
    }

</style>
