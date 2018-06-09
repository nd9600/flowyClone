<template>
    <div v-if="clipboardNotEmpty">
        <p style="margin: 0;">{{this.clipboard}}: {{taskContent}}</p>
        <span>
            <b style="display: inline;">mode: {{this.clipboardMode}}</b>
            <button
                @click="setClipboard(null); setCurrentTopRightTab('settings')"
                class="btn"
                style="float: right;"
            >x
            </button>
        </span>
    </div>
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
                "setClipboard",
                "setCurrentTopRightTab"               
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

<style scoped>
</style>