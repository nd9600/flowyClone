<template>
    <div class="taskFlexbox">
        <div
            v-if="task.tasks.length > 0"
            class="showHide"
            @click="expandChildrenFlag = ! expandChildrenFlag"
        >
            {{ showHideButtonText }}
        </div>
        <div class="task">
            <div class="mainTaskContainer">
                <img
                    class="bullet"
                    src="../assets/bullet.svg"
                    @click="toggleContextMenu"
                    @dblclick="displayModal">
                <modal
                    v-if="showModal"
                    @close="hideModal"
                >
                    <template slot="header">Task {{ taskID }} - {{ task.content }}</template>
                    <detailedTask
                        slot="body"
                        :taskID="taskID"></detailedTask>
                </modal>
                <div class="contextMenuLocation">
                    <transition name="fade">
                        <div
                            v-if="showContextMenu"
                            class="contextMenu"
                        >
                            <a
                                v-if="task.tasks.length > 0"
                                class="contextMenuLink"
                                @click="expandChildrenFlag = ! expandChildrenFlag"
                            >
                                {{ showHideText }}
                            </a>
                            <a
                                class="contextMenuLink"
                                @click="toggleComplete">Complete</a>
                            <a
                                class="contextMenuLink"
                                @click="bold">Bold</a>
                            <div class="separator"></div>
                            <a
                                class="contextMenuLink"
                                @click="addNewTask(); toggleContextMenu()">Add new child</a>
                            <a
                                class="contextMenuLink"
                                @click="displayModal(); toggleContextMenu()">Edit</a>
                            <a
                                class="contextMenuLink"
                                @click="deleteTask(); toggleContextMenu()">Delete</a>
                            <div class="separator"></div>
                            <a
                                class="contextMenuLink"
                                @click="copyTask">Copy</a>
                            <a
                                class="contextMenuLink"
                                @click="cutTask">Cut</a>

                            <!-- you shouldn't be able to paste a task into itself -->
                            <a
                                v-if="clipboard != null && clipboard !== taskID"
                                class="contextMenuLink"
                                @click="pasteInto">Paste into</a>

                            <div class="separator"></div>
                            <a
                                class="contextMenuLink"
                                @click="moveUp">Move up</a>
                            <a
                                class="contextMenuLink"
                                @click="moveDown">Move down</a>
                        </div>
                    </transition>
                </div>

                <span
                    style="margin-left: 5px; width:100%;"
                >
                    <textarea
                        v-resize-on-insert
                        ref="taskInput"
                        v-model="taskContent"
                        :id="`task-${task.id}-input`"
                        :class="{
                            bold: task.bold, 
                            completed: task.complete
                        }"
                        type="text"
                        class="taskText"
                    ></textarea> 
                </span>

                <button
                    class="btn"
                    @click="addNewTask"
                >+
                </button>

                <button
                    class="btn btn--danger"
                    @click="deleteTask"
                >x
                </button>
            </div>

            <div :class="{completed: task.complete}">
                <div>
                    <p
                        v-if="task.description.length > 0"
                        class="description leftIndent"
                        style="margin-top: 0; margin-bottom: 0;"
                    >{{ task.description }}</p>
                </div>

                <div
                    class="leftIndent"
                >
                    <a
                        v-if="task.link.length > 0"
                        :href="task.link"
                    >
                        link
                    </a>
                    <p
                        v-if="task.author.length > 0"
                        class="smallText"
                    >{{ task.author }}
                    </p>
                </div>

                <div class="leftIndent">
                    <tags
                        v-if="tags.length > 0"
                        :tags="tags"
                    >
                    </tags>
                </div>
            </div>

            <div>
                <div v-if="expandChildrenFlag">
                    <!-- you need to bind arrays like this for them to work properly -->
                    <tasks
                        v-if="task.tasks.length > 0"
                        :outerTaskID="task.id"
                        :taskIDs="[...task.tasks]"
                        class="innerTasks"
                    >
                    </tasks>
                </div>
                <div
                    v-if="! expandChildrenFlag"
                    class="leftIndent"
                >
                    <p
                        v-if="numberOfChildren > 0"
                        class="smallText"
                    >{{ numberOfChildren }} {{ numberOfChildren | pluralise }}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import DetailedTask from "./DetailedTask.vue";
import * as task from "../base/task.js";
import {arraymove} from "../base/useful_functions.js";

export default {
    name: "Task",
    components: {
        DetailedTask
    },
    filters: {
        pluralise(n) {
            return n === 1 ? "child" : "children";
        }
    },
    props: {
        taskID: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            showContextMenu: false,
            showModal: false,
            expandChildrenFlag: true
        };
    },
    computed: {
        ...mapGetters([
            "taskStorageUID",
            "rootTaskIDs",
            "taskByID",
            "tasksInTask",
            "tagsInTask",
            "showInnerTasks",
            "clipboard",
            "clipboardMode"
        ]),
        task() {
            return this.taskByID(this.taskID);
        },
        taskContent: {
            get() {
                return this.task.content;
            },
            set(newContent) {
                this.task.content = newContent;
                this.setTask(this.task);
            }
        },

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
    },
    methods: {
        ...mapMutations([
            "incrementTaskStorageUID",
            "setTask",
            "setRootTaskIDs",
            "addTaskToTask",
            "setClipboard",
            "setClipboardMode",
            "removeTaskFromRoot",
            "removeTaskFromParentTask"
        ]),

        toggleComplete() {
            this.task.complete = !this.task.complete;
            this.toggleContextMenu();
            this.setTask(this.task);
        },

        toggleContextMenu() {
            this.showContextMenu = !this.showContextMenu;
        },

        bold() {
            this.task.bold = !this.task.bold;
            this.$nextTick(() => {
                Stretchy.resize(this.$refs.taskInput);
            });
            this.toggleContextMenu();
            this.setTask(this.task);
        },
        addNewTask() {
            this.incrementTaskStorageUID();
            let newTask = new task.TaskObject({
                id: this.taskStorageUID,
                content: "",
                parent: this.task.id
            });
            this.setTask(newTask);
            this.addTaskToTask({taskID: this.task.id, newTaskID: newTask.id});

            this.$nextTick(() => {
                let addedTaskInput = document.getElementById(`task-${newTask.id}-input`);
                if (addedTaskInput) {
                    addedTaskInput.focus();
                }
            });
        },
        deleteTask() {
            let confirm = window.confirm("Are you sure you want to delete this?");
            if (confirm) {
                this.$emit("deleteTask", this.task.id);
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
        pasteInto() {
            let taskIDToPaste = this.getTaskIDToPasteAndRemoveOriginalTask();
            this.task.tasks.push(taskIDToPaste);
            this.toggleContextMenu();
        },
        moveUp() {
            let parentTaskID = this.task.parent;
            if (parentTaskID === "root") {
                let rootTaskIDs = JSON.parse(JSON.stringify(this.rootTaskIDs));
                let parentTaskIDIndex = rootTaskIDs.indexOf(this.task.id);
                let newPosition = parentTaskIDIndex - 1;
                if (newPosition < 0) {
                    newPosition = rootTaskIDs.length;
                }
                arraymove(rootTaskIDs, parentTaskIDIndex, newPosition);
                this.setRootTaskIDs(rootTaskIDs);
            } else {
                let parentTask = this.taskByID(parentTaskID);
                let parentTaskIDIndex = parentTask.tasks.indexOf(this.task.id);
                let newPosition = parentTaskIDIndex - 1;
                if (newPosition < 0) {
                    newPosition = parentTask.tasks.length;
                }
                arraymove(parentTask.tasks, parentTaskIDIndex, newPosition);
                this.setTask(parentTask);
            }
            this.toggleContextMenu();
        },

        moveDown() {
            let parentTaskID = this.task.parent;
            if (parentTaskID === "root") {
                let rootTaskIDs = JSON.parse(JSON.stringify(this.rootTaskIDs));
                let parentTaskIDIndex = rootTaskIDs.indexOf(this.task.id);
                let newPosition = parentTaskIDIndex + 1;
                if (newPosition === rootTaskIDs.length) {
                    newPosition = 0;
                }
                arraymove(rootTaskIDs, parentTaskIDIndex, newPosition);
                this.setRootTaskIDs(rootTaskIDs);
            } else {
                let parentTask = this.taskByID(parentTaskID);
                let parentTaskIDIndex = parentTask.tasks.indexOf(this.task.id);
                let newPosition = parentTaskIDIndex + 1;
                if (newPosition === parentTask.tasks.length) {
                    newPosition = 0;
                }
                arraymove(parentTask.tasks, parentTaskIDIndex, newPosition);
                this.setTask(parentTask);
            }
            this.toggleContextMenu();
        },

        displayModal() {
            this.showModal = true;
            this.showContextMenu = false;
        },
        hideModal() {
            this.showModal = false;
        }
    }
};
</script>

<style scoped>
    .taskFlexbox {
        display: flex;
        margin: 10px 0 10px 0;
    }

    .task {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 5px 0 0 33px;
        width: 100%;
    }

    .completed {
        opacity: 0.4;
        text-decoration: line-through solid currentcolor;
    }

    .showHide {
        width: 2vw;
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
        z-index: 2;
        height: 0;
    }

    .contextMenu {
        display: flex;
        flex-direction: column;
        min-height: 58px;
        min-width: 80px;

        margin: 16px 0 10px -38px;

        background: #f6f6f6;
        border: 1px solid #bbb;
        border-radius: 4px;
    }

    .contextMenuLink {
        padding: 1px 5px 1px 5px;
    }

    .contextMenuLink:hover {
        color: #fff;
        background-color: var(--link-colour);
        transition: background-color 200ms ease 0s;
        border-bottom: 0;
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

    .taskText, textarea, input[type="text"] {
        display: inline;
        padding: 6px 10px 0px 10px;
        margin: 0 0 3px 3px;
        line-height: 20px;
        min-height: 11px;
        min-width: 90%;
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
        border: 3px solid var(--link-colour);

        transition: background-color 200ms ease 0s;
        color: #fff;
    }
    .btn:focus {
        border: 3px solid var(--link-colour);
    }

    .btn--danger:hover {
        background-color: #e00808;
        border: 3px solid #e00808;
    }
    .btn--danger:focus {
        border: 3px solid #e00808;
    }

    .bold {
        font-weight: bold;
    }

    .smallText {
        display: inline;
        font-size: 1.2rem;
        color: #696969;
    }

    .description {
        font-size: 1.5rem;
        color: #696969;
        white-space: pre-line;
    }

    .leftIndent {
        margin-left: 40px;
    }

</style>
