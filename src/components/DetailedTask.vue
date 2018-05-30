<template>
    <div>
        <h1>Task</h1>
        <div class="separator"></div>
        <h3 @click="goHome"><a>Go home</a></h3>
        
        <fieldset>
            <legend>content</legend>
            <textarea v-model="task.content"></textarea>

            <div style="padding-top: 15px;">
                description
                <textarea v-model="task.description"></textarea>
            </div>

            <tags
                v-if="tags.length > 0"
                :tags="tags"
            >
            </tags>
        </fieldset>

        <br />

        <fieldset>
            <p>complete <input type="checkbox" v-model="task.complete"></p>

            <div style="padding: 20px 0 20px 0;">
                <a :href="taskLink">
                    link
                </a>
                <input type="text" v-model="task.link">
            </div>

            <p>author <input type="text" v-model="task.author"></p>
        </fieldset>

        <br />

        <fieldset>
            <p>bold <input type="checkbox" v-model="task.bold"></p>
        </fieldset>
    </div>
</template>

<script>
    import {getTagsInTask} from "../base/task.js";
    import {mapMutations} from "vuex";

    export default {
        name: "detailedTask",
        props: ["taskID"],
        data() {
            return {
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
        }
        methods: {
            ...mapMutations([
                "setTask"
            ]),
            goHome() {
                this.$root.$emit("change-component-event", "home", {tasks: this.$root.tasks});
            }
        },
        computed: {
            taskLink() {
                if (this.task.link.length > 0) {
                    return this.task.link;
                }
                return "#";
            },
            tags() {
                return getTagsInTask(this.task);
            }
        },
        watch: {
            task: {
                handler: function (newTask) { 
                    if (shouldUpdateTask) {
                        this.setTask(newTask);
                    }
                },
                deep: true
            },
        },
    }
</script>

<style>

</style>
