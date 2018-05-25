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

export default {
    name: "app",
    props: ["currentComponent", "componentProp"],
    components: {
        Home,
        DetailedTask  
    },
    methods: {
        ...mapMutations([
            "changeSearchTerm"
        ])
    },
    created: function() {
        //clear the search term when escape is pressed
        //arrow function preserves context
        window.addEventListener('keyup', (event) => {
            if (event.keyCode == 27) {
                this.changeSearchTerm("");
            }
      });
    }
}
</script>

<style>
</style>