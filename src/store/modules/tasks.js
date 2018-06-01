import {getTagsInString} from "../../base/task.js";

const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: new Map(),
    tasksChangeTracker: 1,
    rootTaskIDs: [],
    taskStorageUID: 0
}

const getters = {
    tasks(state, gettersArg) {
        return state.tasksChangeTracker && state.tasks;
    },
    tasksAsArray(state, gettersArg) {
        return Array.from(gettersArg.tasks.values());
    },
    taskByID: (state, gettersArg) => id => {
        return gettersArg.tasks.get(id);
    },
    hasTask: (state, gettersArg) => id => {
        return gettersArg.tasks.has(id);
    },
    tasksInTask: (state, gettersArg) => id => {
        if (! gettersArg.hasTask(id)) {
            return [];
        }
        let thisTask = gettersArg.taskByID(id);
        return thisTask.tasks.map(taskID => gettersArg.taskByID(taskID));
    },

    rootTaskIDs(state, gettersArg) {
        return state.rootTaskIDs;
    },
    rootTasks(state, gettersArg) {
        return gettersArg.rootTaskIDs.map(id => gettersArg.taskByID(id));
    },

    tagsInTask: (state, gettersArg) => task => {
        let tagsInContent = getTagsInString(task.content);
        let tagsInDescription = getTagsInString(task.description);
        let tagsToReturn = tagsInContent.concat(tagsInDescription);
        if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
            let innerTasks = gettersArg.tagsInTasks(task.tasks)
            tagsToReturn = tagsToReturn.concat(innerTasks);
        }
        return tagsToReturn.unique();
    },

    tagsInTasks: (state, gettersArg) => (tasks) => {
        return tasks.map(taskID => {
            let innerTask = gettersArg.taskByID(taskID);
            return gettersArg.tagsInTask(innerTask);
        }).flatten().unique();
    },

    taskStorageUID(state, gettersArg) {
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
        let task = state.tasks.get(taskID);
        task.tasks.push(newTaskID);
        mutations.incrementTaskChangeTracker(state);
    },

    addTaskToRoot(state, taskID) {
        state.rootTaskIDs.push(taskID);
    },

    initialiseTasks(state) {
        let tasksKey = STORAGE_KEY + "-tasks";
        let mapStringFromLocalStorage = localStorage.getItem(tasksKey);
        if (mapStringFromLocalStorage) {
            state.tasks = new Map(JSON.parse(mapStringFromLocalStorage));
        }

        let rootTaskIDsKey = STORAGE_KEY + "-rootTaskIDs";
        let rootTaskIDsString = localStorage.getItem(rootTaskIDsKey);
        if (rootTaskIDsString) {
            state.rootTaskIDs = JSON.parse(rootTaskIDsString);
        }

        let UIDKey = STORAGE_KEY + "-taskStorageUID";
        let UIDString = localStorage.getItem(UIDKey);
        if (UIDString) {
            state.taskStorageUID = JSON.parse(UIDString);
        }
        mutations.incrementTaskChangeTracker(state);
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