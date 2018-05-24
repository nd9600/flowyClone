<template>
  <div>
    <home></home>
  </div>
</template>

<script>
import Home from "./components/Home.vue";

import {mapMutations} from "vuex";
export default {
    name: "app",
    data () {
        return {
        }
    },
    components: {
        Home   
    },
    methods: {
        ...mapMutations([
            "changeSearchTerm"
        ])
    },
    mounted: function() {
        var vm = this;

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