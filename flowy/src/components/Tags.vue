<template>
    <span>
        <a 
            v-for="tag in this.tags"
            class="tagLink"
            @click.prevent="updateSearchTerm"
        >
            #{{tag}}
        </a>
    </span>
</template>

<script>
    import {mapMutations} from "vuex";

    export default {
        props: ["tags"],
        methods: {
            ...mapMutations([
                "changeSearchTerm"
            ]),
            updateSearchTerm(event) {
                //only adds the text following the #
                this.changeSearchTerm(event.target.innerText.slice(1));
            }
        }
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
