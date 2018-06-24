import Vue from 'vue';

import App from './App.vue';

import Tasks from "./components/Tasks.vue";
import Tags from "./components/Tags.vue";
import Task from "./components/Task.vue";
import Modal from "./components/Modal.vue";

//imported so that we get the array functions
import {extract, cloneAndModify} from "./base/useful_functions.ts";

interface Array {
  unique(): Array;
  flatten(): Array;
  flattenDeep(): Array;
  diff(a: Array): Array;
}

interface Object {
  assign(): Object;
}

interface Task {
  id: number,
  content: string,
  description: string,
  complete: string,
  author: string,
  link: string,
  tasks: Task[],
  parent?: string|number,
  bold: boolean
}

Vue.component("tasks", Tasks);
Vue.component("tags", Tags);
Vue.component("task", Task);
Vue.component("modal", Modal);

// register a global custom directive called `v-resize-on-insert` that resizes an element when inserted into the DOM
Vue.directive('resize-on-insert', {
  inserted: function (el) {
    Stretchy.resize(el);
  }
});

new App({
  el: "#app"
});