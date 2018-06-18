import Vue from 'vue';

import App from './App.vue';

import Tasks from "./components/Tasks.vue";
import Tags from "./components/Tags.vue";
import Task from "./components/Task.vue";
import Modal from "./components/Modal.vue";

//imported so that we get the array functions
import {extract, cloneAndModify} from "base/useful_functions.js";

Vue.component(Tasks);
Vue.component(Tags);
Vue.component(Task);
Vue.component(Modal);

// register a global custom directive called `v-resize-on-insert` that resizes an element when inserted into the DOM
Vue.directive('resize-on-insert', {
  inserted: function (el) {
    Stretchy.resize(el);
  }
});

class TaskObject {
    constructor(obj) {
        this.id = obj.id;
        this.content = obj.content;
        this.description = obj.description || "";

        this.complete = obj.complete || false;
        this.author = obj.author || "";
        this.link = obj.link || "";

        this.tasks = obj.tasks || [];
        this.parent = obj.parent || null;

        this.bold = obj.bold || false;
    }
}

new Vue(App);