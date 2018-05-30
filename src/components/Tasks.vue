<template>
    <div class="tasksList">
        <task 
            v-for="taskID in this.taskIDs"
            v-on:removeTask="removeTask"
            :taskID="taskID"
            :key="taskID"
        >
        </task>
    </div>
</template>

<script>
    export default {
        props: ["taskIDs"],
        methods: {
            //event is fired from a child task
            removeTask(task) {
                console.log(task);
                // let indexOfTask = this.tasks.indexOf(task);
                // this.tasks.splice(indexOfTask, 1);
            }
        }
    }
</script>

<style>
     ul {
        padding: 0;
    }

    li {
        margin: 0 10px;
    }
</style>