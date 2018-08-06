<template>
    <div id="settings">
        <label>
            <input 
                v-model="computedShowChildren" 
                type="checkbox">
            show children
        </label>
        <br />
        storage method
        <label>
            localStorage
            <input 
                v-model="computedStorageMethod" 
                type="radio" 
                value="localStorage">
        </label>
        <label>
            firebase
            <input 
                v-model="computedStorageMethod" 
                type="radio" 
                value="firebase">
        </label>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
export default {
    name: "Settings",
    data() {
        return {};
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
    },
    methods: {
        ...mapMutations([
            "setShowChildren",
            "setStorageMethod"
        ])
    }
};
</script>

<style scoped>
    #settings {
        padding: 0 5px 0 5px;
    }
</style>