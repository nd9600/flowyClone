<template>
    <div>
        <label>
            state key
            <input v-model="computedFirebaseStateKey" type="text">
        </label>
        <button @click="initialiseState">load tasks</button>
        <button @click="saveTasks">save tasks</button>
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
                "initialiseState",
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