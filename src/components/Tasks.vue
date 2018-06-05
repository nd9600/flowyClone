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
    import {mapMutations} from "vuex";

    export default {
        props: ["outerTask", "taskIDs"],
        methods: {
            ...mapMutations({
                removeTaskMutation: "removeTask"
            }),

            //event is fired from a child task
            removeTask(taskID) {
                if (this.outerTask) {
                    let indexOfTask = this.outerTask.tasks.indexOf(taskID);
                    this.outerTask.tasks.splice(indexOfTask, 1);
                }
                this.removeTaskMutation(taskID);
            }
        }
    }
</script>