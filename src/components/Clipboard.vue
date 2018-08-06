<template>
    <div v-if="clipboardNotEmpty">
        <p style="margin: 0;">{{ clipboard }}: {{ taskContent }}</p>
        <span>
            <b style="display: inline;">mode: {{ clipboardMode }}</b>
            <button
                class="btn"
                style="float: right;"
                @click="setClipboard(null); setCurrentTopRightTab('settings')"
            >x
            </button>
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
export default {
    name: "Clipboard",
    data() {
        return {};
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
    },
    methods: {
        ...mapMutations([
            "setClipboard",
            "setCurrentTopRightTab"               
        ])
    }
};
</script>

<style scoped>
</style>