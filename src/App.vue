<template>
  <div>
    <keep-alive>
        <component
            :is="this.currentComponent"
            v-bind="this.componentProp"
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
    props: ["currentComponent", "componentProp"],
    data () {
        return {
            tasks: [],
            shouldUpdateTasks: true
        }
    },
    components: {
        Home,
        DetailedTask  
    },
    methods: {
        ...mapMutations([
            "initialiseTaskStorageUID",
            "changeSearchTerm"
        ])
    },
    watch: {
        // needs a deep watcher because the array has objects in it
        tasks: {
            handler: function (newTasks, oldTasks) { 
                console.log("in watcher")
                if (this.shouldUpdateTasks) {
                    localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(newTasks));
                }
            },
            deep: true
        }
    },
    created: function() {
        console.log("in hook");
        var vm = this;

        vm.initialiseTaskStorageUID();

        this.shouldUpdateTasks = false;
        if (localStorage.getItem(STORAGE_KEY + "-tasks") === null) {
            this.tasks = [];
        } else {
            this.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
        }
        this.shouldUpdateTasks = true;
        this.$root.changeCurrentComponent("home", {tasks: this.tasks});

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