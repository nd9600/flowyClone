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
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ["tasks"]
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
