<template>
  <div>
    <keep-alive>
        <component
            :is="this.currentComponent"
            v-bind="this.componentProp"
            v-on:changeCurrentComponent="changeCurrentComponent"
        >
        </component>
    </keep-alive>
    
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import DetailedTask from "./components/DetailedTask.vue";
import {mapMutations} from "vuex";
import {STORAGE_KEY} from "./store/store.js";

export default {
    name: "app",
    data () {
        return {
            tasks: [],
            currentComponent: "home",
            componentProp: {tasks: this.tasks}
        }
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
            //the event is actually emitted to the vue instance in main.js
            console.log(component);
            console.log(prop);
            this.currentComponent = component;
            this.componentProp = prop;
        }
    },
    created: function() {
        console.log("in hook");
        var vm = this;

        vm.initialiseTasks();

        this.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
        this.changeCurrentComponent("home", {tasks: this.tasks});

        //clear the search term when escape is pressed
        window.addEventListener('keyup', function(event) {
            if (event.keyCode == 27) {
                vm.changeSearchTerm("");
            }
      });
    }
}
</script>

<style>
</style>