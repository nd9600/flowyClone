<template>
    <div class="tasksList">
        <task
            v-for="taskID in this.computedTaskIDs"
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
        name: "tasks",
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
        },
        computed: {
            computedTaskIDs() {
                //the v-for isn't updating on addition/deletion
                return this.taskIDs;
            }
        }
    }
</script>