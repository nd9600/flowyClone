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
        componentProp: {tasks: []},
        tasks: [],
        shouldUpdateTasks: true
    },
    components: {
        Home,
        DetailedTask  
    },
    methods: {
        ...mapMutations([
            "initialiseTaskStorageUID",
            "changeSearchTerm"
        ]),
        changeCurrentComponent(component, prop) {
            if (this.currentComponent !== component) {
                this.currentComponent = component;
            }
            this.componentProp = prop;
        }
    },
    watch: {
        // needs a deep watcher because the array has objects in it
        tasks: {
            handler: function (newTasks, oldTasks) { 
                if (this.shouldUpdateTasks) {
                    localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(newTasks));
                }
            },
            deep: true
        }
    },
    created: function() {
        this.initialiseTaskStorageUID();

        this.shouldUpdateTasks = false;
        if (localStorage.getItem(STORAGE_KEY + "-tasks") === null) {
            this.tasks = [];
        } else {
            this.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
        }
        this.shouldUpdateTasks = true;

        this.changeCurrentComponent("home", {tasks: this.tasks});

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
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>