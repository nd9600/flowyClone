import Vue from 'vue';
import {mapMutations} from "vuex";

import App from './App.vue';

import {store, STORAGE_KEY} from "./store/store.js";

import Tasks from "./components/Tasks.vue";
import Tags from "./components/Tags.vue";
import Task from "./components/Task.vue";

Vue.component("tasks", Tasks);
Vue.component("tags", Tags);
Vue.component("task", Task);

Array.prototype.unique = function() {
    return this.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse)
};

Array.prototype.flatten = function() {
    return [].concat(...this);
};

new Vue({
    el: '#app',
    template: `<app
        :currentComponent="this.currentComponent"
        :componentProp="this.componentProp"
    ></app>`,
    data: {
        currentComponent: "home",
        componentProp: {tasks: []},
        tasks: [],
        shouldUpdateTasks: true
    },
    components: {
        App
    },
    methods: {
        ...mapMutations([
            "initialiseTaskStorageUID"
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
    created() {

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
    },
    store
})
