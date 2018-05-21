<template>
    <li>
        <div class="task">
            <input class="toggle" type="checkbox" v-model="task.complete">
            <label style="display: inline">{{task.content}}</label>
            <tags
                v-if="task.tags.length > 0"
                :tags="task.tags"
            >
            </tags>
            <button class="removeButton" @click="removeTask">x</button>
        </div>
    </li>
</template>

<script>
    export default {
        props: ["task"],
        methods: {
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
    .removeButton {
        display: inline;
        margin: auto 0;
        margin-bottom: auto;
        font-size: 18px;
        color: transparent;
        background-color: transparent;
        border-color: transparent;
    }
    .removeButton:hover {
        color: #999;
    }
</style>
