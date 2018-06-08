<template>
    <div>
        <label>
            <input type="checkbox" v-model="computedShowChildren">
            show children
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
                "setShowChildren"
            ])
        },
        computed: {
            ...mapGetters([
                "showChildren"
            ]),
            computedShowChildren: {
                get() {
                    return this.showChildren;
                },
                set(value) {
                    this.setShowChildren(value);
                }
            }
        }
    }
</script>

<style scoped>
    .inputWrapper {
        white-space: nowrap;
    }
</style>