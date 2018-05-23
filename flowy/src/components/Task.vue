<template>
    <span class="task">
        <a class="bullet" @click="toggleComplete"></a>

        <span :class="{ strikethrough: task.complete }">
            <span 
                class="taskText" 
                contentEditable="true" 
                @blur.prevent="changeContent"
            >{{task.content}}
            </span>
            <a
                v-if="task.link.length > 0"
                :href="task.link"
                class="taskLink"
            >
                link
            </a>

            
        </span>

        <tags
            v-if="tags.length > 0"
            :tags="tags"
        >
        </tags>

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
    // import _ from 'lodash';
    import {getTagsInTask} from "../base/useful_functions.js";

    export default {
        props: ["task"],
        methods: {
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            },

            //only runs once a second, if the content has actually changed
            changeContent: //_.debounce(
                function(event) {
                    let value = event.target.textContent && event.target.textContent.trim();
                    if (! value || value === this.task.content) {
                        return;
                    }
                    this.task.content = value;
                }// }, 1000)
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
        max-width: 50%;
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
