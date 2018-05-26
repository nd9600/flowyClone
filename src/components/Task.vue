<template>
    <span class="task">
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
                    <a @click="toggleComplete">Complete</a>
                    <a @click="$emit('removeTask', task)">Remove</a>
                    <a @click="goToDetailedTask">Edit</a>
                    <a @click="addNewTask">Add new task</a>
                </div>
            </div>

            <span :class="{ strikethrough: task.complete }">
                <input
                    ref="taskInput"
                    v-model="task.content"
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

        <div class="leftIndent">
            <tasks
                v-if="task.tasks.length > 0"
                :tasks="task.tasks"
                :class="{ strikethrough: task.complete }"
            >
            </tasks>
        </div>
    </span>
</template>

<script>
    import * as task from "../base/task.js";
    import {getTagsInTask} from "../base/useful_functions.js";
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "task",
        props: ["task"],
        data() {
            return {
                showContextMenu: false
            }
        },
        methods: {
            ...mapMutations([
                "incrementTaskStorageUID"
            ]),

            goToDetailedTask() {
                this.$root.$emit("change-component-event", "detailedTask", {task: this.task});
            },
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            },
            addNewTask() {
                this.incrementTaskStorageUID();
                this.task.tasks.push(new task.Task({
                    id: this.taskStorageUID,
                    content: "blank",
                    complete: false
                }));
            }
        },
        computed: {
            ...mapGetters([
                "taskStorageUID"
            ]),

            tags() {
                return getTagsInTask(this.task);
            }
        },
        mounted(){
            //resizes the task content input when the task is first created
            Stretchy.resize(this.$refs.taskInput);
        }
    }
</script>

<style>
    .task {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 5px;
    }

    .contextMenuLocation {
        position: absolute;
        z-index: 2;
        height: 0px;
    }
    .contextMenu {
        display: flex;
        flex-direction: column;
        min-height: 58px;
        min-width: 80px;

        padding: 5px;
        margin: 16px 0 10px -30px;
        
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
        background-color: transparent;
        border-color: transparent;

        text-decoration: none;
    }
    .removeButton:hover {
        color: #999;
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
        margin: 0 0 0 60px;
    }

</style>
