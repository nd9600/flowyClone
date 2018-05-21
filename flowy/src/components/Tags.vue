<template>
    <span>
        <a 
            v-for="tag in this.tags"
            :href="'#' + tag"
            class="tagLink"
        >
            #{{tag}}
        </a>
    </span>
</template>

<script>
    export default {
        props: ["tags"]
    }
</script>

<style>
    .tagLink {
        color: #999;
        margin: 0 5px 0 0;
    }
    .tagLink:hover {
        background-color: #f2f2f2;
    }
</style>
