<template>
    <span class="taskFlexbox">
        <div 
            v-if="task.tasks.length > 0"
            @click="showChildren = ! showChildren"
            class="showHide"
        >
            {{showHideButtonText}}
        </div>
        <div class="task">
            <div class="mainTaskContainer">
                <img 
                    @click="goToDetailedTask" 
                    @mouseover="showContextMenu = true"
                    @mouseleave="showContextMenu = false"
                    class="bullet" 
                    src="../assets/bullet.svg">
                <div
                    class="contextMenuLocation"
                >
                    <div
                        v-if="showContextMenu"
                        @mouseover="showContextMenu = true"
                        @mouseleave="showContextMenu = false" 
                        class="contextMenu"
                    >
                        <a
                            v-if="task.tasks.length > 0"
                            @click="showChildren = ! showChildren"
                        >
                            {{showHideText}} children
                        </a>
                        <a @click="task.complete = ! task.complete">Complete</a>
                        <a @click="bold">Bold</a>
                        <div class="separator"></div>
                        <a @click="goToDetailedTask">Edit</a>
                        <a @click="$emit('removeTask', task)">Remove</a>
                        <a @click="addNewTask">Add new child</a>
                    </div>
                </div>

                <span 
                    :class="{ strikethrough: task.complete }"
                    style="margin-left: 5px;"
                >
                    <input
                        ref="taskInput"
                        v-model="task.content"
                        :class="{ bold: task.bold }"
                        type="text"
                        class="taskText"
                    >       
                </span>

                <button 
                    @click="$emit('removeTask', task)"
                    class="removeButton"
                >x</button>
            </div>

            <div>
                <p 
                    v-if="task.description.length > 0"
                    class="description leftIndent"
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
                    class="author"
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

            <div v-if="showChildren">
                <tasks
                    v-if="task.tasks.length > 0"
                    :tasks="task.tasks"
                >
                </tasks>
            </div>
        </div>
    </span>
</template>

<script>
    import * as task from "../base/task.js";
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "task",
        props: ["task"],
        data() {
            return {
                showContextMenu: false,
                showChildren: true
            }
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID"
            ]),

            goToDetailedTask() {
                this.$root.$emit("change-component-event", "detailedTask", {task: this.task});
            },
            bold() {
                this.task.bold = ! this.task.bold;
                setTimeout(() => {
                    Stretchy.resize(this.$refs.taskInput)
                }, 10);
            },
            addNewTask() {
                this.incrementTaskStorageUID();
                this.task.tasks.push(new task.Task({
                    id: this.taskStorageUID,
                    content: "",
                    complete: false
                }));
            }
        },
        computed: {
            ...mapGetters([
                "taskStorageUID"
            ]),

            showHideButtonText() {
                return (this.showChildren ? "[-]" : "[+]");
            },

            showHideText() {
                return (this.showChildren ? "Hide" : "Show");
            },

            tags() {
                return task.getTagsInTask(this.task);
            }
        },
        mounted(){
            //resizes the task content input when the task is first created
            Stretchy.resize(this.$refs.taskInput);
        }
    }
</script>

<style>
    .taskFlexbox {
        display: flex;
        padding: 5px;
    }

    .task {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 5px;
        margin-left: 33px;
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
        height: 0px;
    }
    .contextMenu {
        display: flex;
        flex-direction: column;
        min-height: 58px;
        min-width: 80px;

        padding: 5px;
        margin: 16px 0 10px -38px;
        
        background: #e1e1e1;
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

    .removeButton {
        min-height: 32px;

        margin: 0 10px 0 10px;

        font-size: 18px;
        color: #ddd;
        background-color: #f6f6f6;
        border-color: #f6f6f6;
        border-radius: 8px;

        text-decoration: none;
    }
    .removeButton:hover {
        background-color: var(--link-colour);
        border: 1px solid var(--link-colour);
        
        transition: background-color 200ms ease 0s;
        color: #fff;
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

    .author {
        display: inline;
        font-size: 1.3rem;
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
