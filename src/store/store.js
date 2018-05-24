import Vue from "vue";
import Vuex from "vuex";

import tasks from "./modules/tasks.js";
import searchTerm from "./modules/searchTerm.js";
import componentSwitcher from "./modules/componentSwitcher.js";

Vue.use(Vuex);

const STORAGE_KEY = 'tasks-flowyClone';

export {store};

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',    
    modules: {
        tasks,
        searchTerm,
        componentSwitcher
    }
});

// save the tasks to localStorage whenever they change
//each module is an object in the state
store.subscribe((mutation, state) => {
    if (["updateTasks"].indexOf(mutation.type) > -1) {
        localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(state.tasks.tasks));
        localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.tasks.taskStorageUID));
    }
});