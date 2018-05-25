<template>
    <div>
        <h1 @click="goHome">Home</h1>
        <textarea 
            v-model="task.content"
        ></textarea>
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

</style>
