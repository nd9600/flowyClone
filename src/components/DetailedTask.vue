<template>
    <div>
        <div>
            <legend>content</legend>
            <textarea
                v-resize-on-insert
                ref="taskInput"
                :class="{
                    bold: task.bold,
                }"
                v-model="task.content"></textarea>

            <div>
                <legend>description</legend>
                <textarea
                    v-resize-on-insert
                    v-model="task.description"></textarea>
            </div>

            <tags
                v-if="tags.length > 0"
                :tags="tags"
            >
            </tags>
        </div>

        <br/>

        <div>
            <span class="bottomInputContainer">
                <span class="inputCol">
                    <span>
                        complete <input
                            v-model="task.complete"
                            type="checkbox">
                    </span>
                    <span>
                        <a :href="taskLink">
                            link
                        </a>
                        <textarea
                            v-resize-on-insert
                            v-model="task.link"></textarea>
                    </span>
                    
                </span>

                <span class="inputCol">
                    <span>
                        bold <input
                            v-model="task.bold"
                            type="checkbox">
                    </span>

                    <span>
                        author <textarea
                            v-resize-on-insert
                            v-model="task.author"></textarea>
                    </span>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "DetailedTask",
    props: {
        taskID: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            //all task's properties must be added here, so they are reactive
            task: {
                id: 0,
                content: "",
                description: "",
                complete: false,
                author: "",
                link: "",
                tasks: [],
                bold: false
            }
        };
    },
    computed: {
        ...mapGetters([
            "taskByID",
            "tagsInTask"
        ]),
        taskLink() {
            if (this.task.link.length > 0) {
                return this.task.link;
            }
            return "#";
        },
        tags() {
            return this.tagsInTask(this.task);
        }
    },
    watch: {
        task: {
            handler: function (newTask) {
                if (this.shouldUpdateTask) {
                    this.setTask(newTask);
                }
                this.$nextTick(() => {
                    Stretchy.resize(this.$refs.taskInput);
                });
            },
            deep: true
        },
    },
    created() {
        this.task = this.taskByID(this.taskID);
        this.shouldUpdateTask = true;

        document.body.classList.add("noscroll");
        this.$once("hook:destroyed", () => {
            document.body.classList.remove("noscroll");
        });
    },
    methods: {
        ...mapMutations([
            "setTask"
        ]),
        goHome() {
            this.$root.$emit("change-component-event", "home");
        }
    }
};
</script>

<style scoped>
    .bold {
        font-weight: bold;
    }

    .bottomInputContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .inputCol {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        max-width: 45%;
    }
</style>
