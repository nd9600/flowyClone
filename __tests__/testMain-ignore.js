import { createLocalVue } from '@vue/test-utils';
import Vuex from "vuex";

//import App from '../src/App.vue';

import Tasks from "../src/components/Tasks.vue";

//imported so that we get the array functions
import {extract, cloneAndModify} from "../src/base/useful_functions.js";

const localVue = createLocalVue();

localVue.use(Vuex);

// register a global custom directive called `v-resize-on-insert` that resizes an element when inserted into the DOM
localVue.directive('resize-on-insert', {
  inserted: function (el) {}
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

export {localVue, TaskObject}