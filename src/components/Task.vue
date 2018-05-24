<template>
    <span class="task">
        <img class="bullet" @click="switchComponent('detailedTask', task)">

        <div :class="{ strikethrough: task.complete }">
            <input
                v-model="taskContent"
                type="text"
                class="taskText"
            >
            <a
                v-if="task.link.length > 0"
                :href="task.link"
                class="taskLink"
            >
                link
            </a>            
        </div>

        <span>
            <button 
                @click="$emit('removeTask', task)"
                class="removeButton"
            >x</button>

            <tags
                v-if="tags.length > 0"
                :tags="tags"
            >
            </tags>
        </span>

        <tasks
            v-if="task.tasks.length > 0"
            :tasks="task.tasks"
            :class="{ strikethrough: task.complete }"
        >
        </tasks>
    </span>
</template>

<script>
    import {getTagsInTask} from "../base/useful_functions.js";
    import {mapMutations} from "vuex";

    export default {
        name: "task",
        props: ["task"],
        methods: {
            ...mapMutations([
                "changeCurrentComponent"
            ]),
            switchComponent(component, prop) {
                this.changeCurrentComponent({component, prop});
            },
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            }
        },
        computed: {
            taskContent: {
                get() {
                    return this.task.content;
                },
                set(value) {
                    this.task.content = value;
                }
            },
            tags() {
                return getTagsInTask(this.task);
            }
        }
    }
</script>

<style>

    .task {
        display: flex;
        justify-content: flex-start;
        padding: 5px;
    }

    .bullet {
        background-color: transparent;
        background-image: url("../assets/bullet.svg");
        height: 32px;
        width: 32px;
        border-radius: 32px;
    }
    .bullet:hover {
        background-color: #aaa;
    }

    .taskText, input[type] {
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

</style>
