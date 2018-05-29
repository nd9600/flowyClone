const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: new Map(),
    rootTaskIDs: [],
    taskStorageUID: 0,
}

const getters = {
    tasks(state) {
        return state.tasks;
    },
    taskByID(state, id) {
        console.log(state.tasks);
        return state.tasks.get(id);
    },
    hasTask(state, id) {
        return state.tasks.has(id);
    },
    tasksInTask(state, id) {
        if (! getters.hasTask(state, id)) {
            return [];
        }
        let thisTask = getters.taskByID(state);
        return thisTask.tasks.map(taskID => getters.taskByID(taskID));
    },

    rootTaskIDs(state) {
        return state.rootTaskIDs;
    },
    rootTasks(state) {
        return state.rootTaskIDs.map(id => getters.taskByID(id));
    },

    taskStorageUID(state) {
        return state.taskStorageUID;
    }
}

const mutations = {
    setTasks(state, tasks) {
        state.tasks = JSON.parse(JSON.stringify(tasks));
    },
    setTask(state, task) {
        let taskID = task["id"];
        state.tasks.set(taskID, task);
    },
    removeTask(state, task) {
        let taskID = task["id"];
        state.tasks.delete(taskID);

        //we need to delete the task ID from the root too
        let rootTaskID = state.rootTaskIDs.indexOf(taskID);
        if (rootTaskID > -1) {
            state.rootTaskIDs.splice(rootTaskID, 1);
        }
    },

    addTaskToRoot(state, task) {
        let taskID = task["id"];
        state.rootTaskIDs.push(taskID);
    },

    initialiseTasks(state) {
        // if (localStorage.getItem(STORAGE_KEY + "-tasks")) {
        //     state.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
        // }

        if (localStorage.getItem(STORAGE_KEY + "-taskStorageUID")) {
            state.taskStorageUID = JSON.parse(localStorage.getItem(STORAGE_KEY + "-taskStorageUID"));
        }
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