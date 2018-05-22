<template>
    <!-- #8203 is a zero width space, so we can set the height of the span when empty -->
    <span class="tags"> &#8203;
        <a 
            v-for="tag in this.tags"
            class="tagLink"
            @click.prevent="updateSearchTerm"
        >
            {{tag}}
        </a>
    </span>
</template>

<script>
    import {mapMutations, mapGetters} from "vuex";

    export default {
        props: ["tags"],
        methods: {
            ...mapMutations([
                "changeSearchTerm"
            ]),
            updateSearchTerm(event) {
                //only adds the text following the #, if it has changed
                if (this.searchTerm !== event.target.innerText.slice(0)) {
                    this.changeSearchTerm(event.target.innerText.slice(0));
                }
            }
        },
        computed: {
            ...mapGetters([
                "searchTerm"
            ])
        }
    }
</script>

<style>
    .tags {
        min-height: 24px;
    }

    .tagLink {
        color: #999;
        margin: 0 5px 0 0;
    }
    .tagLink:hover {
        background-color: #f2f2f2;
        color: #982c61;
        border-bottom: 2px solid #4a4a4a;
    }
</style>
