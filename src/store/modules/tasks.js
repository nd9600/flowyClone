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
        return Array.from(getters.tasks(state).values());
    },
    taskByID: (state) => id => {
        console.log("taskByID");
        console.log(getters.tasks(state).get(id));
        return getters.tasks(state).get(id);
    },
    hasTask: (state) => id => {
        console.log("hasTask");
        console.log(getters.tasks(state).has(id));
        return getters.tasks(state).has(id);
    },
    tasksInTask: (state) => id => {
        console.log("tasksInTask");
        //console.trace();
        console.log(state);
        console.log(id);
        if (! getters.hasTask(state)(id)) {
            return [];
        }
        let thisTask = getters.taskByID(state)(id);
        console.log(thisTask);
        return thisTask.tasks.map(taskID => getters.taskByID(state, getters)(taskID));
    },

    rootTaskIDs(state) {
        return state.rootTaskIDs;
    },
    rootTasks(state) {
        return getters.rootTaskIDs(state).map(id => getters.taskByID(state, getters)(id));
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
        state.tasks = JSON.parse(JSON.stringify(tasks));
        mutations.incrementTaskChangeTracker(state);
    },
    setTask(state, task) {
        let taskID = task["id"];
        state.tasks.set(taskID, task);
        mutations.incrementTaskChangeTracker(state);
    },
    removeTask(state, task) {
        let taskID = task["id"];
        state.tasks.delete(taskID);

        //we might need to delete the task ID from the root too
        let rootTaskID = state.rootTaskIDs.indexOf(taskID);
        if (rootTaskID > -1) {
            state.rootTaskIDs.splice(rootTaskID, 1);
        }
        mutations.incrementTaskChangeTracker(state);
    },

    addTaskToTask(state, {taskID, newTaskID}) {
        let task = getters.taskByID(state)(taskID);
        console.log(taskID);
        console.log(task);
        task.tasks.push(newTaskID);
        mutations.incrementTaskChangeTracker(state);
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