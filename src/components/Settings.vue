<template>
    <div id="settings">
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
            "storageMethod"
        ]),
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