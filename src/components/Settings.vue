<template>
    <div id="settings">
        <label>
            <input type="checkbox" v-model="computedShowChildren">
            show children
        </label>
        <br />
        storage method
        <label>
            localStorage
            <input type="radio" value="localStorage" v-model="computedStorageMethod">
        </label>
        <label>
            firebase
            <input type="radio" value="firebase" v-model="computedStorageMethod">
        </label>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    export default {
        name: "settings",
        data() {
            return {};
        },
        methods: {
            ...mapMutations([
                "setShowChildren",
                "setStorageMethod"
            ])
        },
        computed: {
            ...mapGetters([
                "showChildren",
                "storageMethod"
            ]),
            computedShowChildren: {
                get() {
                    return this.showChildren;
                },
                set(value) {
                    this.setShowChildren(value);
                }
            },
            computedStorageMethod: {
                get() {
                    return this.storageMethod;
                },
                set(value) {
                    this.setStorageMethod(value);
                }
            }
        }
    }
</script>

<style scoped>
    #settings {
        padding: 0 5px 0 5px;
    }
</style>