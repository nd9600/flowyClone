<template>
    <div class="paddedLeftAndBottom">
        <label>
            state key
            <input
                v-resize-on-insert
                v-model="computedFirebaseStateKey"
                type="text"
                style="width: 100%;">
        </label>
        <button @click="confirmLoad">load tasks</button>
        <button @click="confirmSave">save tasks</button>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "Firebase",
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            "firebaseStateKey"
        ]),
        computedFirebaseStateKey: {
            get() {
                return this.firebaseStateKey;
            },
            set(value) {
                this.setFirebaseStateKey(value);
            }
        }
    },
    methods: {
        ...mapMutations([
            "setFirebaseStateKey",
        ]),
        ...mapActions([
            "initialiseTasks",
            "saveStateToFirebase"
        ]),
        confirmLoad: function() {
            if (window.confirm("Are you sure you want to load tasks?")) {
                this.initialiseTasks();
            }
        },
        confirmSave: function() {
            if (window.confirm("Are you sure you want to save tasks to Firebase? This will overwrite the existing ones")) {
                this.saveStateToFirebase();
            }
        }
    }
};
</script>

<style scoped>
    .paddedLeftAndBottom {
        padding: 0 0 10px 10px;
    }
</style>