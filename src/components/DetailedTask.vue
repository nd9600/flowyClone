<template>
    <div>
        <p>{{task.content}}</p>
    </div>
</template>

<script>
    import {getTagsInTask} from "../base/useful_functions.js";

    export default {
        name: "detailedTask",
        props: ["propToComponent"],
        methods: {
            toggleComplete() {
                this.task.complete = ! this.task.complete;
            }
        },
        computed: {
            task() {
                return this.propToComponent;
            },
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

</style>
