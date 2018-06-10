<template>
    <div>
        <label>
            state key
            <input v-resize-on-insert v-model="computedFirebaseStateKey" type="text">
        </label>
        <button @click="initialiseTasks">load tasks</button>
        <button @click="saveStateToFirebase">save tasks</button>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from "vuex";
    export default {
        name: "firebase",
        data() {
            return {};
        },
        methods: {
            ...mapMutations([
                "setFirebaseStateKey",
            ]),
            ...mapActions([
                "initialiseTasks",
                "saveStateToFirebase"
            ])
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
        }
    }
</script>

<style scoped>
</style>