<template>
    <span class="task">
        <a class="bullet" @click="toggleComplete"></a>

        <span :class="{ strikethrough: task.complete }">
            <p 
                class="taskText" 
                contentEditable="true" 
                @input="changeContent"
            >
                {{task.content}}
            </p>
            <a
                v-if="task.link.length > 0"
                :href="task.link"
                class="taskLink"
            >
                link
            </a>

            <tags
                v-if="task.tags.length > 0"
                :tags="task.tags"
            >
            </tags>
        </span>

        <button class="removeButton" @click="removeTask(task)">x</button>

        <tasks
            v-if="task.tasks.length > 0"
            :tasks="task.tasks"
            :class="{ strikethrough: task.complete }"
        >
        </tasks>
    </span>
</template>

<script>
    import _ from 'lodash';
    import {mapMutations} from "vuex";
    import {cloneAndModify} from "../base/useful_functions.js";

    export default {
        props: ["task"],
        methods: {
            ...mapMutations([
                "changeTask",
                "removeTask"
            ]),

            toggleComplete() {
                let oldTask = this.task;
                let newTask = cloneAndModify(oldTask, {complete: (! oldTask.complete) })
                this.changeTask({newTask, oldTask});
            },

            //should only run once a second
            changeContent(event) {
                let value = event.target.textContent && event.target.textContent.trim();
                if (! value) {
                    return;
                }
                let oldTask = this.task;
                let newTask = cloneAndModify(oldTask, {content: value})
                this.changeTask({newTask, oldTask});
            }
        }
    }
</script>

<style>

    .task {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0px;
    }

    .bullet {
        background-color: transparent;
        background-image: url("../assets/bullet.svg");
        height: 18px;
        width: 18px;
        border: none;
    }
    .bullet:hover {
        background-color: #aaa;
        border-radius: 12px;
    }

    .taskText {
        display: inline;
        padding: 0 15px 0 5px;
        margin: 0px;
        line-height: 20px;
        min-height: 20px;
    }

    .removeButton {
        margin: auto 0;
        margin-bottom: auto;
        font-size: 18px;
        color: transparent;
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
