<template>
    <div id="settings">
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
    #settings {
        padding: 0 5px 0 5px;
    }
</style>