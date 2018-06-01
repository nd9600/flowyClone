import Vue from "vue";
import Vuex from "vuex";

import tasksModule from "./modules/tasks.js";
import searchTermModule from "./modules/searchTerm.js";

Vue.use(Vuex);

const STORAGE_KEY = 'tasks-flowyClone';

export {STORAGE_KEY, store};

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',    
    modules: {
        tasksModule,
        searchTermModule
    }
});

store.subscribe((mutation, state) => {
    if (["setTask", "removeTask", "addTaskToTask", "addTaskToRoot"].indexOf(mutation.type) > -1) {
        let localTasksKey = STORAGE_KEY + "-tasks";
        let mapString = JSON.stringify(Array.from(state.tasksModule.tasks.entries()));
        localStorage.setItem(localTasksKey, mapString);

        let rootTaskIDsKey = STORAGE_KEY + "-rootTaskIDs";
        let rootTaskIDsString = JSON.stringify(state.tasksModule.rootTaskIDs);
        localStorage.setItem(rootTaskIDsKey, rootTaskIDsString);

        let localUIDkey = STORAGE_KEY + "-taskStorageUID";
        localStorage.setItem(localUIDkey, JSON.stringify(state.tasksModule.taskStorageUID));
    }
});