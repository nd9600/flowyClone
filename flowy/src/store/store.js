import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const STORAGE_KEY = 'tasks-flowyClone';

export const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        tasks: [],
        taskStorageUID: 0,
        searchTerm: ""
    },
    getters: {
        tasks: (state) => {
            return state.tasks;
        },
        tasksFromStorage: (state) => {
            var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            tasks.forEach(function (task, index) {
                task.id = index;
            })
            state.taskStorageUID = tasks.length;
            return tasks;
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
        addTask: (state, task) => {
            state.tasks.push(task);
        },
        removeTask: (state, task) => {
            state.tasks.splice(state.tasks.indexOf(task), 1);
        },
        changeTask: (state, {newTask, oldTask}) => {
            state.tasks.splice(state.tasks.indexOf(oldTask), 1, newTask);
        },
        saveTasks: (state) => {
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
        }
    },
    //asynchronous
    actions: {
        saveTasks: (context) => {
            context.commit("saveTasks")
        }
    }
});

// save the tasks to localStorage whenever they change
store.subscribe((mutation, state) => {
    if (["addTask", "removeTask", "changeTask"].indexOf(mutation.type) > -1) {
        localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(state.tasks));
        localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.taskStorageUID));
    }
});