const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: new Map(),
    tasksChangeTracker: 1,
    rootTaskIDs: [],
    taskStorageUID: 0
}

const getters = {
    tasks(state) {
        return state.tasksChangeTracker && state.tasks;
    },
    tasksAsArray(state) {
        console.log(getters.tasks(state).values());
        console.log(Array.from(getters.tasks(state).values()));
        return Array.from(getters.tasks(state).values());
    },
    taskByID(state, id) {
        return getters.tasks(state).get(id);
    },
    hasTask(state, id) {
        return getters.tasks(state).has(id);
    },
    tasksInTask(state, id) {
        if (! getters.hasTask(state, id)) {
            return [];
        }
        let thisTask = getters.taskByID(id);
        return thisTask.tasks.map(taskID => getters.taskByID(state, taskID));
    },

    rootTaskIDs(state) {
        return state.rootTaskIDs;
    },
    rootTasks(state) {
        return getters.rootTaskIDs(state).map(id => getters.taskByID(state, id));
    },

    taskStorageUID(state) {
        return state.taskStorageUID;
    }
}

const mutations = {
    incrementTaskChangeTracker(state) {
        state.tasksChangeTracker += 1;
    },
    setTasks(state, tasks) {
        mutations.incrementTaskChangeTracker(state);
        state.tasks = JSON.parse(JSON.stringify(tasks));
    },
    setTask(state, task) {
        mutations.incrementTaskChangeTracker(state);

        let taskID = task["id"];
        state.tasks.set(taskID, task);
    },
    removeTask(state, task) {
        mutations.incrementTaskChangeTracker(state);

        let taskID = task["id"];
        state.tasks.delete(taskID);

        //we need to delete the task ID from the root too
        let rootTaskID = state.rootTaskIDs.indexOf(taskID);
        if (rootTaskID > -1) {
            state.rootTaskIDs.splice(rootTaskID, 1);
        }
    },

    addTaskToRoot(state, taskID) {
        state.rootTaskIDs.push(taskID);
    },

    initialiseTasks(state) {
        // if (localStorage.getItem(STORAGE_KEY + "-tasks")) {
        //     mutations.incrementTaskChangeTracker(state);
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