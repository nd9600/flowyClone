const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    taskStorageUID: 0,
}

const getters = {
    taskStorageUID: (state) => {
        return state.taskStorageUID;
    }
}

const mutations = {
    initialiseTasks(state) {
        // replace the state object with the stored item
        if (localStorage.getItem(STORAGE_KEY + "-taskStorageUID")) {
            state.taskStorageUID = JSON.parse(localStorage.getItem(STORAGE_KEY + "-taskStorageUID"));
        }
    },
    saveTasksToLocalStorage: (state) => {
        localStorage.setItem(STORAGE_KEY + "-taskStorageUID", JSON.stringify(state.taskStorageUID));
    },
    incrementTaskStorageUID: (state) => {
        state.taskStorageUID++;
    }
}

export default {
    state,
    getters,
    mutations
}