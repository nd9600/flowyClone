<template>
    <span class="task">
        <img class="bullet" @click="goToDetailedTask(task)">

        <span :class="{ strikethrough: task.complete }">
            <input
                v-model="task.content"
                type="text"
                class="taskText"
            >
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
        </span>

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

    export default {
        name: "task",
        props: ["task"],
        methods: {
            goToDetailedTask(prop) {
                this.$root.$emit("change-component-event", "detailedTask", {task: prop});
            },
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            }
        },
        computed: {
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
    }

</style>
