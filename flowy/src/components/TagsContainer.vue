<template>
    <div class="tagsContainer">
        <a 
            v-for="tag in this.tags"
            :href="'#' + tag"
            class="tagLink"
        >
            #{{tag}}
        </a>
    </div>
</template>

<script>
    export default {
        props: ["tags"]
    }
</script>

<style>
    .tagsContainer {
        display: inline;
    }

    .tagLink {
        color: #999;
        margin: 0 5px 0 0;
    }
    .tagLink:hover {
        background-color: #f2f2f2;
    }
</style>
