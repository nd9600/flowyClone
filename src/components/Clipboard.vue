<template>
    <fieldset id="clipboard">
        <legend>Clipboard</legend>
        <p>nothing yet</p>
    </fieldset>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    export default {
        name: "clipboard",
        data() {
            return {};
        },
        methods: {
            ...mapMutations([
                
            ])
        },
        computed: {
            ...mapGetters([
                "clipboard",
                "clipboardMode"
            ])
        }
    }
</script>

<style>
    #clipboard {
        padding: 10px;
        border: 1px solid var(--separator-colour);
    }
</style>