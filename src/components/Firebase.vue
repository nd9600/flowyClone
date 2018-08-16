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
        <button @click="initialiseTasks">load tasks</button>
        <button @click="saveStateToFirebase">save tasks</button>
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
        ])
    }
};
</script>

<style scoped>
    .paddedLeftAndBottom {
        padding: 0 0 10px 10px;
    }
</style>