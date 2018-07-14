<template>
    <div class="tasksList">
        <task
            v-for="taskID in this.filteredTaskIDs"
            @deleteTask="deleteInnerTask"
            :taskID="taskID"
            :key="taskID"
        >
        </task>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";

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
            ...mapGetters([
                "shownTaskIDs"
            ]),
            filteredTaskIDs() {
                return this.taskIDs.filter(id => this.shownTaskIDs.indexOf(id) > -1);
            }
        }
    }
</script>