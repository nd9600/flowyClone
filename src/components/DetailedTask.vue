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
    </div>
</template>

<script>
    import {getTagsInTask} from "../base/useful_functions.js";

    export default {
        name: "detailedTask",
        props: ["task"],
        methods: {
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
        }
    }
</script>

<style>

</style>
