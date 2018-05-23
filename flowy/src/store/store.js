import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export {STORAGE_KEY, store};

const STORAGE_KEY = 'tasks-flowyClone';

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        tasks: [],
        taskStorageUID: 0,
        searchTerm: ""
    },
    getters: {
        tasks: (state) => {
            //you might need to deep clone this
            return state.tasks;
        },
        taskStorageUID: (state) => {
            return state.taskStorageUID;
        },
        searchTerm: (state) => {
            return state.searchTerm;
        }
    },
    //synchronous
    mutations: {
        initialiseTasks(state) {
            // replace the state object with the stored item
            if (localStorage.getItem(STORAGE_KEY + "-tasks")) {
                state.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
            }
            if (localStorage.getItem(STORAGE_KEY + "-taskStorageUID")) {
                state.taskStorageUID = JSON.parse(localStorage.getItem(STORAGE_KEY + "-taskStorageUID"));
            }
        },
        saveTasksToLocalStorage: (state) => {
            localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(state.tasks));
            localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.taskStorageUID));
        },
        incrementTaskStorageUID: (state) => {
            state.taskStorageUID++;
        },
        changeSearchTerm: (state, newTerm) => {
            if (state.searchTerm !== newTerm) {
                state.searchTerm = newTerm;
            }
        },
        updateTasks: (state, newTasks) => {
            // have to deep clone the tasks so that we don't accidentally use a reference to the original object instead
            state.tasks = JSON.parse(JSON.stringify(newTasks));
        }
    },
    //asynchronous
    actions: {
        saveTasksToLocalStorage: (context) => {
            context.commit("saveTasksToLocalStorage")
        },
        updateTasks: (context, newTasks) => {
            context.commit("updateTasks", newTasks);
        }
    }
});

// save the tasks to localStorage whenever they change
store.subscribe((mutation, state) => {
    if (["updateTasks"].indexOf(mutation.type) > -1) {
        localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(state.tasks));
        localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.taskStorageUID));
    }
});