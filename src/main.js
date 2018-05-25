import Vue from 'vue';

import App from './App.vue';

import {store} from "./store/store.js";

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
        v-on:changeCurrentComponent="changeCurrentComponent"
    ></app>`,
    data: {
        currentComponent: "home",
        componentProp: {tasks: []}
    },
    components: {
        App
    },
    methods: {
        changeCurrentComponent(component, prop) {
            //the event is actually emitted to the vue instance in main.js
            console.log(component);
            console.log(prop);
            if (this.currentComponent !== component) {
                this.currentComponent = component;
            }
            this.componentProp = prop;
        }
    },
    store
})
