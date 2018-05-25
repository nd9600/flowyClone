<template>
    <div>
        <h1 @click="goHome"><a>Home</a></h1>

        <label>
            content 
            <textarea v-model="task.content"></textarea>
        </label>

        <label>
            description 
            <textarea v-model="task.description"></textarea>
        </label>

        <br />

        <label>
            complete <input type="checkbox" v-model="task.complete">
        </label>

        <div class="separator"></div>

        <div>
            <a :href="taskLink">
                link
            </a>
            <input type="text" v-model="task.link">
        </div>

        <br />

        <label>
            author 
            <input type="text" v-model="task.author">
        </label>
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
