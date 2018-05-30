import {getTagsInString} from "../../base/task.js";

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
        return getters.tasks(state).get(id);
    },
    hasTask: (state) => id => {
        return getters.tasks(state).has(id);
    },
    tasksInTask: (state) => id => {
        if (! getters.hasTask(state)(id)) {
            return [];
        }
        let thisTask = getters.taskByID(state)(id);
        return thisTask.tasks.map(taskID => getters.taskByID(state, getters)(taskID));
    },

    rootTaskIDs(state) {
        return state.rootTaskIDs;
    },
    rootTasks(state) {
        return getters.rootTaskIDs(state).map(id => getters.taskByID(state, getters)(id));
    },

    tagsInTask: (state) => task => {
        let tagsInContent = getTagsInString(task.content);
        let tagsInDescription = getTagsInString(task.description);
        let tagsToReturn = tagsInContent.concat(tagsInDescription);
        if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
            let innerTasks = getters.tagsInTasks(state)(task.tasks)
            tagsToReturn = tagsToReturn.concat(innerTasks);
        }
        return tagsToReturn.unique();
    },

    tagsInTasks: (state) => (tasks) => {
        return tasks.map(taskID => {
            let innerTask = getters.taskByID(state, getters)(taskID);
            return getters.tagsInTask(state)(innerTask);
        }).flatten().unique();
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

    // need to add mutation for removing an inner task

    addTaskToTask(state, {taskID, newTaskID}) {
        let task = getters.taskByID(state)(taskID);
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