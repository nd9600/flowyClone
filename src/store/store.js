import Vue from "vue";
import Vuex from "vuex";

import tasks from "./modules/tasks.js";
import searchTerm from "./modules/searchTerm.js";

Vue.use(Vuex);

const STORAGE_KEY = 'tasks-flowyClone';

export {STORAGE_KEY, store};

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',    
    modules: {
        tasks,
        searchTerm
    }
});