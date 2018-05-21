<template>
    <div class="tasksList">
        <ul>
            <task 
                v-for="task in this.tasks"
                :task="task"
                :key="task.id"
            >
            </task>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ["tasks"],
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