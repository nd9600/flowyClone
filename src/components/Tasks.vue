<template>
    <div class="tasksList">
        <task 
            v-for="task in this.tasks"
            v-on:removeTask="removeTask"
            :task="task"
            :key="task.id"
        >
        </task>
    </div>
</template>

<script>
    export default {
        props: ["tasks"],
        methods: {
            //event is fired from a child task
            removeTask(task) {
                let indexOfTask = this.tasks.indexOf(task);
                this.tasks.splice(indexOfTask, 1);
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