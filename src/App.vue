<template>
  <div>
    <home :tasks="this.localTasks"></home>
  </div>
</template>

<script>
import Home from "./components/Home.vue";
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
        Home   
    },
    methods: {
        ...mapMutations([
            "initialiseTasks",
            "changeSearchTerm"
        ]),
        ...mapActions([
            "updateTasks"
        ]),
    },
    computed: {
        ...mapGetters([
            "tasks"
        ]),
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
    mounted: function() {
        var vm = this;

        vm.initialiseTasks();
        // have to deep clone the tasks so that we don't accidentally use a reference to the original object instead
        this.shouldUpdateTasks = false;
        //this.localTasks = this.tasks.map(task => Object.assign({}, task));
        this.localTasks = JSON.parse(JSON.stringify(this.tasks));
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