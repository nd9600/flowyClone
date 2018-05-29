<template>
  <div>
    <keep-alive>
        <transition name="fade">
            <component
                :is="this.currentComponent"
                v-bind="this.componentProp"
            >
            </component>
        </transition>
    </keep-alive>
    
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import DetailedTask from "./components/DetailedTask.vue";
import {mapMutations} from "vuex";

import {store, STORAGE_KEY} from "./store/store.js";

export default {
    name: "app",
    el: '#app',
    data: {
        currentComponent: "home",
        componentProp: {}
    },
    components: {
        Home,
        DetailedTask  
    },
    methods: {
        ...mapMutations([
            "initialiseTasks",
            "changeSearchTerm"
        ]),
        changeCurrentComponent(component, prop) {
            if (this.currentComponent !== component) {
                this.currentComponent = component;
            }
            this.componentProp = prop;
        }
    },
    created: function() {
        this.initialiseTasks();
        this.changeCurrentComponent("home", {});

        this.$on("change-component-event", (component, prop) => {
            this.changeCurrentComponent(component, prop);
        });

        //clear the search term when escape is pressed
        //arrow function preserves context
        window.addEventListener('keyup', (event) => {
            if (event.keyCode == 27) {
                this.changeSearchTerm("");
            }
        });
    },
    store
}
</script>

<style>
    a {
      text-decoration: none;
      color: #2c8898; 
      cursor: pointer;
    }
    a:hover {
        color: #982c61;
        border-bottom: 2px solid #4a4a4a; 
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>