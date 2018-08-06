<template>
    <div>
        <label>
            state key
            <input 
                v-resize-on-insert 
                v-model="computedFirebaseStateKey" 
                type="text" 
                style="min-width: 125px;">
        </label>
        <button @click="initialiseTasks">load tasks</button>
        <button @click="saveStateToFirebase">save tasks</button>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
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
</style>