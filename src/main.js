import Vue from 'vue';

import App from './App.vue';

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

Array.prototype.flattenDeep = function() {
    return this.reduce((acc, val) => {
        let isArray = Array.isArray(val);
        if (isArray) {
            return acc.concat(val.flattenDeep());
        }
        return acc.concat(val);
    }, [])
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

new Vue(App);
