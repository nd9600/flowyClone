<template>
    <div class="tasksList">
        <task
            v-for="taskID in filteredTaskIDs"
            :task-id="taskID"
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
            required: true
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

        //or set a variable in all tasks to show all children?

        parentContainsTheSearchedTag() {
            if (!(this.searchTerm && this.searchTerm[0] === "#")) {
                return false;
            }

            //at the root
            if (this.outerTaskID) {
                return false;
            }

            function recurse(taskID) {
                //get parent
                //if parent contains tag, return true
                //if parent has parent, check
                //if parent doesn't have parent, return false
            }

            return true;
        },
        filteredTaskIDs() {
            return (this.parentContainsTheSearchedTag) ? this.taskIDs : this.taskIDs.filter(id => this.shownTaskIDs.indexOf(id) > -1);
        }
    },
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
                });
            }
            this.deleteTask(taskID);
        }
    }
};
</script>