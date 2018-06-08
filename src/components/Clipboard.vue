<template>
    <fieldset 
        v-if="clipboardNotEmpty" 
        id="clipboard" 
        class="normalText"
    >
        <legend>Clipboard</legend>
        <p style="margin: 0;">{{this.clipboard}}: {{taskContent}}</p>
        <span>
            <b style="display: inline;">mode: {{this.clipboardMode}}</b>
            <button
                @click="setClipboard(null)"
                class="btn"
                style="float: right;"
            >x
            </button>
        </span>
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
                "setClipboard"                
            ])
        },
        computed: {
            ...mapGetters([
                "clipboard",
                "clipboardMode",
                "taskByID"
            ]),
            clipboardNotEmpty() {
                return this.clipboard !== null;
            },
            taskContent() {
                return this.taskByID(this.clipboard).content;
            }
        }
    }
</script>

<style>
    #clipboard {
        padding: 10px;
        border: 1px solid var(--separator-colour);
    }
</style>