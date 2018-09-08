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
     .btn {
        min-height: 32px;
        margin: 0 10px 0 10px;

        font-size: 18px;
        color: #ddd;
        background-color: #f6f6f6;
        border-color: #f6f6f6;
        border-radius: 8px;

        text-decoration: none;
    }

    .btn:hover {
        background-color: var(--link-colour);
        border: 3px solid var(--link-colour);

        transition: background-color 200ms ease 0s;
        color: #fff;
    }
    .btn:focus {
        border: 3px solid var(--link-colour);
    }
</style>