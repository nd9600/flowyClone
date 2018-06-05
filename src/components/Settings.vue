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
        name: "Settings",
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

<style>
    #settings {
        position: absolute;
        top: 10%;
        right: 10%;
        padding: 10px;
        border: 1px solid var(--separator-colour);
        opacity: 0.1;
    }
    #settings:hover {
        opacity: 1;
    }

    .inputWrapper {
        white-space: nowrap;
    }
</style>