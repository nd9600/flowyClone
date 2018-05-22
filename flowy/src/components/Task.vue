<template>
    <span class="task">
        <a class="bullet" @click="toggleComplete"></a>

        <span :class="{ strikethrough: task.complete }">
            <span v-if="task.length > 0">
                <a :href="task.link">
                    <p 
                        class="taskText" 
                        contentEditable="true" 
                        @input="changeContent"
                    >
                        {{task.content}}
                    </p>
                </a>
            </span>
            <span v-else>
                <p 
                    class="taskText" 
                    contentEditable="true" 
                    @input="changeContent"
                >
                    {{task.content}}
                </p>
            </span>

            <tags
                v-if="task.tags.length > 0"
                :tags="task.tags"
            >
            </tags>
        </span>

        <button class="removeButton" @click="removeTask">x</button>

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

    export default {
        props: ["task"],
        methods: {
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            },

            //should only run once a second
            changeContent(event) {
                let value = event.target.textContent && event.target.textContent.trim();
                console.log(value);
                if (! value) {
                    return;
                }
                this.task.content = value;
            },
            removeTask() {
                this.$store.commit("removeTask", this.task);
            }
        }, 
        watch: {
            //need a deep watcher because it's an object
            task: {
                handler: function (newTask, oldTask) { 
                    this.$store.commit("changeTask", {newTask, oldTask});
                },
                deep: true
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
