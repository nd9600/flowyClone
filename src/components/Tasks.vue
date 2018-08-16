<template>
    <div class="tasksList">
        <task
            v-for="taskID in filteredTaskIDs"
            :taskID="taskID"
            :key="taskID"
            @deleteTask="deleteInnerTask"
        >
        </task>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "Tasks",
    props: {
        outerTaskID: {
            type: Number,
            required: false,
            default: -1
        },
        taskIDs: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters([
            "shownTaskIDs",
            "searchTerm"
        ]),

        filteredTaskIDs: function () {
            return this.taskIDs.filter(id => this.shownTaskIDs.indexOf(id) > -1);
        }
    },
    methods: {
        ...mapMutations([
            "removeTaskFromParentTask",
            "deleteTask"
        ]),

        //event is fired from a child task
        deleteInnerTask(taskID) {
            if (this.outerTaskID > -1) {
                this.removeTaskFromParentTask({
                    parentTaskID: this.outerTaskID,
                    innerTaskID: taskID
                });
            }
            this.deleteTask(taskID);
        }
    }
};
</script>