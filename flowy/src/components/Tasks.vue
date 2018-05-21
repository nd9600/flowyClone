<template>
    <div class="tasksList">
        <ul>
            <li v-for="task in this.tasks">
                {{task.content}}
                <tags
                    v-if="task.tags.length > 0"
                    :tags="task.tags"
                >
                </tags>
                <button class="removeButton" @click="removeTask(task)">x</button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ["tasks"],
        methods: {
            removeTask(task) {
                console.log(task);
                console.log(this.$store.state.tasks);
                this.$store.commit("removeTask", task);
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

    .removeButton {
        display: inline;
        margin: auto 0;
        margin-bottom: auto;
        font-size: 18px;
        color: transparent;
        background-color: transparent;
        border-color: transparent;
    }
    .removeButton:hover {
        color: #999;
    }
</style>
