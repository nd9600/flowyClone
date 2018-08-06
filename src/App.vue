<template>
    <home/>
</template>

<script>
import Home from "./components/Home.vue";
import {mapMutations, mapActions} from "vuex";

import store from "./store/store.js";

export default {
    el: "#app",
    name: "App",
    components: {
        Home
    },
    methods: {
        ...mapMutations([
            "changeSearchTerm"
        ]),
        ...mapActions([
            "initialiseApp"
        ]),
    },
    created: function() {
        this.initialiseApp();
            
        //clear the search term when escape is pressed
        //arrow function preserves context
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 27) {
                document.activeElement.blur();
                this.changeSearchTerm("");
            }
        });
    },
    store
};
</script>

<style>
    :root {
        --link-colour: #42b983;
        --separator-colour: #d1d1d1;
    }

    body.noscroll {
        overflow: hidden;
    }

    a {
        color: var(--link-colour);
        text-decoration: none;
        cursor: pointer;
    }

    a:hover {
        color: #982c61;
        border-bottom: 2px solid #4a4a4a;
    }

    button:focus, button:hover, input[type="submit"]:focus, input[type="submit"]:hover, input[type="reset"]:focus, input[type="reset"]:hover, input[type="button"]:focus, input[type="button"]:hover {
        background-color: var(--link-colour);
        border-color: var(--link-colour);
        color: #fff;
    }

    input[type="search"]::-webkit-search-cancel-button {
        display: none
    }

    .searchBoxWrapper {
        display: inline-flex;
        align-items: center;
    }

    .inputBox {
        display: block;
        margin: 10px 0 10px 0;
        padding: 10px;
        min-width: 200px;
        min-height: 42px;
    }

    .clearButton {
        margin-left: -25px;
    }

    .selected {
        color: #982c61;
    }

    .separator {
        background-color: var(--separator-colour);
        height: 1px;
        margin: 10px 0 10px 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>