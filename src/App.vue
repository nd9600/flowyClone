<template>
  <div>
    <keep-alive>
        <component
            :is="this.currentComponent"
        >
        </component>
    </keep-alive>
    
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import DetailedTask from "./components/DetailedTask.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";

export default {
    name: "app",
    data () {
        return {
            //props change this array, the watcher below then commits the new tasks to the store
            localTasks: [],
            shouldUpdateTasks: false
        }
    },
    components: {
        Home,
        DetailedTask  
    },
    methods: {
        ...mapMutations([
            "changeCurrentComponent",
            "initialiseTasks",
            "changeSearchTerm"
        ]),
        ...mapActions([
            "updateTasks"
        ])
    },
    computed: {
        ...mapGetters([
            "currentComponent",
            "componentProp",
            "tasks"
        ])
    },
    watch: {
        // needs a deep watcher because the array has objects in it
        localTasks: {
            handler: function (newTasks, oldTasks) { 
                if (this.shouldUpdateTasks) {
                    this.updateTasks(newTasks);
                }
            },
            deep: true
        }
    },
    created: function() {
        console.log("in hook");
        var vm = this;

        vm.initialiseTasks();

        this.shouldUpdateTasks = false;

        // have to deep clone the tasks so that we don't accidentally use a reference to the original array in the state instead - if we need, changing localTasks would change the array in the state outside a mutation, which we don't want to do
        this.localTasks = JSON.parse(JSON.stringify(this.tasks));
        this.changeCurrentComponent({
            component: "home",
            prop: this.localTasks
        });
        this.shouldUpdateTasks = true;

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