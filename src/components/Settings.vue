<template>
    <div class="paddedLeftAndBottom">
        <span style="font-weight: bold;">storage method</span>
        <label class="noBold">
            local storage
            <input
                v-model="computedStorageMethod"
                type="radio"
                value="localStorage">
        </label>
        <label class="noBold">
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
    .paddedLeftAndBottom {
        padding: 0 0 10px 10px;
    }

    .noBold {
        font-weight: normal;
    }
</style>