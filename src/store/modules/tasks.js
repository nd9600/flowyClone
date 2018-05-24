const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: [],
    taskStorageUID: 0,
}

const getters = {
    tasks: (state) => {
        //you might need to deep clone this
        return state.tasks;
    },
    taskStorageUID: (state) => {
        return state.taskStorageUID;
    }
}

const mutations = {
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
    updateTasks: (state, newTasks) => {
        // have to deep clone the tasks so that we don't accidentally use a reference to the original object instead
        state.tasks = JSON.parse(JSON.stringify(newTasks));
    }
}

//asynchronous
const actions = {
    saveTasksToLocalStorage: (context) => {
        context.commit("saveTasksToLocalStorage")
    },
    updateTasks: (context, newTasks) => {
        context.commit("updateTasks", newTasks);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}