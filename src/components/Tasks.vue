<template>
    <div class="tasksList">
        <task
            v-for="taskID in this.taskIDs"
            @deleteTask="deleteInnerTask"
            :taskID="taskID"
            :key="taskID"
        >
        </task>
    </div>
</template>

<script>
    import {mapMutations} from "vuex";

    export default {
        props: ["outerTaskID", "taskIDs"],
        methods: {
            ...mapMutations([
                "removeTaskFromParentTask",
                "deleteTask"
            ]),

            //event is fired from a child task
            deleteInnerTask(taskID) {
                if (this.outerTaskID) {
                    this.removeTaskFromParentTask({
                        parentTaskID: this.outerTaskID,
                        innerTaskID: taskID
                    })
                }
                this.deleteTask(taskID);
            }
        }
    }
</script>