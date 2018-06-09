<template>
    <div class="taskFlexbox">
        <div
            v-if="this.shouldShowChildren && task.tasks.length > 0"
            @click="expandChildrenFlag = ! expandChildrenFlag"
            class="showHide"
        >
            {{showHideButtonText}}
        </div>
        <div class="task">
            <div class="mainTaskContainer">
                <img
                    @click="toggleContextMenu"
                    @dblclick="goToDetailedTask"
                    class="bullet"
                    src="../assets/bullet.svg">
                <div class="contextMenuLocation">
                    <div
                        v-if="showContextMenu"
                        class="contextMenu"
                    >
                        <a
                            v-if="task.tasks.length > 0"
                            @click="expandChildrenFlag = ! expandChildrenFlag"
                        >
                            {{showHideText}}
                        </a>
                        <a @click="toggleComplete">Complete</a>
                        <a @click="bold">Bold</a>
                        <div class="separator"></div>
                        <a @click="goToDetailedTask">Edit</a>
                        <a @click="deleteTask(); toggleContextMenu()">Delete</a>
                        <a @click="addNewTask(); toggleContextMenu()">Add new child</a>
                        <div class="separator"></div>
                        <a @click="copyTask">Copy</a>
                        <a @click="cutTask">Cut</a>
                        <a v-if="this.clipboard != null" @click="pasteBefore">Paste before</a>

                        <!-- you shouldn't be able to paste a task into itself -->
                        <a v-if="this.clipboard != null && this.clipboard !== this.taskID" @click="pasteInto">Paste into</a>
                        <a v-if="this.clipboard != null" @click="pasteAfter">Paste after</a>
                    </div>
                </div>

                <span
                    :class="{ strikethrough: task.complete }"
                    style="margin-left: 5px;"
                >
                    <input
                        ref="taskInput"
                        v-resize-on-insert
                        v-model="task.content"
                        :class="{ bold: task.bold }"
                        type="text"
                        class="taskText"
                    >       
                </span>

                <button
                    @click="addNewTask"
                    class="btn"
                >+
                </button>

                <button
                    @click="deleteTask"
                    class="btn dangerBtn"
                >x
                </button>
            </div>

            <div>
                <p
                    v-if="task.description.length > 0"
                    class="description leftIndent"
                    style="margin-top: 0; margin-bottom: 0;"
                >{{task.description}}</p>
            </div>

            <div class="leftIndent">
                <a
                    v-if="task.link.length > 0"
                    :href="task.link"
                >
                    link
                </a>
                <p
                    v-if="task.author.length > 0"
                    class="smallText"
                >{{task.author}}
                </p>
            </div>

            <div class="leftIndent">
                <tags
                    v-if="tags.length > 0"
                    :tags="tags"
                >
                </tags>
            </div>

            <div v-if="this.shouldShowChildren">
                <div v-if="expandChildrenFlag">
                    <tasks
                        v-if="task.tasks.length > 0"
                        :outerTaskID="task.id"
                        :taskIDs="task.tasks"
                    >
                    </tasks>
                </div>
                <div
                    v-if="! expandChildrenFlag"
                    class="leftIndent"
                >
                    <p
                        v-if="this.numberOfChildren > 0"
                        class="smallText"
                    >{{this.numberOfChildren}} {{this.numberOfChildren | pluralise}}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "task",
        props: ["taskID"],
        data() {
            return {
                showContextMenu: false,
                expandChildrenFlag: true,
                shouldUpdateTask: false,

                //all task's properties must be added here, so they are reactive
                task: {
                    id: 0,
                    content: "",
                    description: "",
                    complete: false,
                    author: "",
                    link: "",
                    tasks: [],
                    bold: false
                }
            }
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID",
                "setTask",
                "addTaskToTask",
                "setClipboard",
                "setClipboardMode",
                "removeTaskFromRoot",
                "removeTaskFromParentTask"
            ]),

            toggleComplete() {
                this.task.complete = ! this.task.complete;
                this.toggleContextMenu();
            },

            toggleContextMenu() {
                this.showContextMenu = ! this.showContextMenu;
            },

            goToDetailedTask() {
                this.$root.$emit("change-component-event", "detailedTask", {taskID: this.taskID});
            },
            bold() {
                this.task.bold = !this.task.bold;
                setTimeout(() => {
                    Stretchy.resize(this.$refs.taskInput)
                }, 0);
                this.toggleContextMenu();
            },
            addNewTask() {
                this.incrementTaskStorageUID();
                let newTask = new task.Task({
                    id: this.taskStorageUID,
                    content: "",
                    parent: this.task.id
                });
                this.setTask(newTask);
                this.addTaskToTask({taskID: this.task.id, newTaskID: newTask.id})
            },
            deleteTask() {
                let confirm = window.confirm("Are you sure you want to delete this?");
                if (confirm) {
                    this.$emit('deleteTask', this.task.id);
                }
            },

            //clipboard
            copyTask() {
                this.setClipboardMode("copy");
                this.setClipboard(this.taskID);
                this.toggleContextMenu();
            },
            cutTask() {
                this.setClipboardMode("cut");
                this.setClipboard(this.taskID);
                this.toggleContextMenu();
            },
            removeOriginalTaskIfCutting(originalTaskID) {
                if (this.clipboardMode === "copy") {
                    return;
                }
                let originalTask = this.taskByID(originalTaskID);
                if (originalTask.parent === "root") {
                    this.removeTaskFromRoot(originalTaskID);
                } else {
                    this.removeTaskFromParentTask({
                        parentTaskID: originalTask.parent,
                        innerTaskID: originalTaskID
                    });
                }
            },
            getTaskIDToPaste() {
                let vm = this;

                function cloneTaskToLeaves(taskID) {
                    vm.incrementTaskStorageUID();
                    let copiedTask = vm.taskByID(taskID);
                    let cloneOfCopiedTask = JSON.parse(JSON.stringify(copiedTask));
                    cloneOfCopiedTask.id = vm.taskStorageUID;
                    cloneOfCopiedTask.tasks = cloneOfCopiedTask.tasks
                        .map(innerTaskID => cloneTaskToLeaves(innerTaskID));
                    vm.setTask(cloneOfCopiedTask);
                    return cloneOfCopiedTask.id;
                }

                //we need to use a whole new task (including all inner tasks) when copying
                if (this.clipboardMode === "copy") {
                    return cloneTaskToLeaves(this.clipboard);
                }
                return this.clipboard;
            },
            getTaskIDToPasteAndRemoveOriginalTask() {
                let taskIDToPaste = this.getTaskIDToPaste();
                this.removeOriginalTaskIfCutting(this.clipboard);

                //have to set the new parent too - we are in the pasted task's parent here
                let taskThatsBeingPasted = this.taskByID(taskIDToPaste);
                taskThatsBeingPasted.parent = this.task.id;
                this.setTask(taskThatsBeingPasted);

                return taskIDToPaste;
            },
            pasteBefore() {
                let taskIDToPaste = this.getTaskIDToPasteAndRemoveOriginalTask();
                this.toggleContextMenu();
            },
            pasteInto() {
                let taskIDToPaste = this.getTaskIDToPasteAndRemoveOriginalTask();
                this.task.tasks.push(taskIDToPaste);
                this.toggleContextMenu();
            },
            pasteAfter() {
                let taskIDToPaste = this.getTaskIDToPasteAndRemoveOriginalTask();
                this.toggleContextMenu();
            }            
        },
        computed: {
            ...mapGetters([
                "taskStorageUID",
                "taskByID",
                "tasksInTask",
                "tagsInTask",
                "showInnerTasks",
                "showChildren",
                "clipboard",
                "clipboardMode"
            ]),

            showHideButtonText() {
                return (this.expandChildrenFlag ? "[-]" : "[+]");
            },

            showHideText() {
                return (this.expandChildrenFlag ? "Hide" : "Show");
            },

            tags() {
                return this.tagsInTask(this.task);
            },

            numberOfChildren() {
                let vm = this;
                function recursiveNumberOfChildren(taskID) {
                    let thisTask = vm.taskByID(taskID);
                    let innerChildren = thisTask.tasks.map(innerTaskID => recursiveNumberOfChildren(innerTaskID));
                    let numberOfInnerChildren = innerChildren.reduce((acc, val) => acc + val, 0);
                    return 1 + numberOfInnerChildren;
                }
                let mappedNumberOfActiveTasks = this.task.tasks.map(taskID => recursiveNumberOfChildren(taskID));
                return mappedNumberOfActiveTasks.reduce((acc, val) => acc + val, 0);
            },

            shouldShowChildren() {
                return this.showInnerTasks || this.showChildren;
            }
        },
        watch: {
            task: {
                handler: function (newTask) {
                    if (this.shouldUpdateTask) {
                        this.setTask(newTask);
                    }
                },
                deep: true
            },
        },
        filters: {
            pluralise(n) {
                return n === 1 ? "child" : "children";
            }
        },
        created() {
            this.task = this.taskByID(this.taskID);

            //setTask is still called without this
            setTimeout(() => this.shouldUpdateTask = true, 0);
        }
    }
</script>

<style>
    .taskFlexbox {
        display: flex;
        margin: 10px 0 10px 0;
    }

    .task {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 5px 0 0 33px;
    }

    .showHide {
        z-index: 2;
        min-width: 25px;
        max-width: 25px;
        padding: 4px;
        margin-right: -33px;
        flex-grow: 1;

        cursor: pointer;
        text-align: center;
        font-weight: lighter;
        color: #999;
        background-color: #f6f6f6;
        border-radius: 8px;
    }

    .showHide:hover {
        color: #fff;
        background-color: var(--link-colour);
        transition: background-color 200ms ease 0s;
    }

    .contextMenuLocation {
        position: absolute;
        z-index: 4;
        height: 0;
    }

    .contextMenu {
        display: flex;
        flex-direction: column;
        min-height: 58px;
        min-width: 80px;

        padding: 5px;
        margin: 16px 0 10px -38px;

        background: #f6f6f6;
        border: 1px solid #bbb;
        border-radius: 4px;
    }

    .mainTaskContainer {
        display: flex;
        align-items: center;
    }

    .bullet {
        height: 32px;
        width: 32px;
        background-color: transparent;
        border-radius: 32px;
        cursor: pointer;
    }

    .bullet:hover {
        background-color: #aaa;
    }

    .taskText, input[type="text"] {
        display: inline;
        padding: 0 15px 0 5px;
        margin: 0 0 3px 3px;
        line-height: 20px;
        min-height: 32px;
        min-width: 300px;
    }

    .btn {
        min-height: 32px;

        margin: 0 10px 0 10px;

        font-size: 18px;
        color: #ddd;
        background-color: #f6f6f6;
        border-color: #f6f6f6;
        border-radius: 8px;

        text-decoration: none;
    }

    .btn:hover {
        background-color: var(--link-colour);
        border: 1px solid var(--link-colour);

        transition: background-color 200ms ease 0s;
        color: #fff;
    }

    .dangerBtn:hover {
        background-color: #e00808;
        border: 1px solid #e00808;
    }

    .strikethrough {
        position: relative;
        color: #999;
    }

    .strikethrough:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        border-bottom: 1px solid #111;
        width: 100%;
    }

    .bold {
        font-weight: bold;
    }

    .smallText {
        display: inline;
        margin-top: 0;
        margin-bottom: 0;
        font-size: 1.2rem;
        color: #696969;
    }

    .description {
        font-size: 1.5rem;
        color: #696969;
    }

    .leftIndent {
        margin-left: 40px;
    }

</style>
