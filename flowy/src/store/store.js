import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const STORAGE_KEY = 'tasks-flowyClone';

//uid in taskStorage means we need to keep taskStorage in Vuex
export const store = new Vuex.Store({
    state: {
        tasks: [],
        taskStorageUID: 0
    },
    getters: {
        getTasks: (state) => {
            return state.tasks;
        },
        loadTasksFromStorage: (state) => {
            var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
                tasks.forEach(function (task, index) {
                task.id = index
            })
            state.uid = tasks.length
            return tasks
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
        saveTasks: (state) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
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
    if (["addTask", "removeTask"].indexOf(mutation.type) > -1) {
        localStorage.setItem(STORAGE_KEY + "-tasks", JSON.stringify(state.tasks));
        localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.taskStorageUID));
    }
});