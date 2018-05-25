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

store.subscribe((mutation, state) => {
    if (["incrementTaskStorageUID"].indexOf(mutation.type) > -1) {
        let key = STORAGE_KEY + "-taskStorageUID";
        localStorage.setItem(key, JSON.stringify(state.tasks.taskStorageUID));
    }
});