import {getTagsInString} from "../../base/task.js";

const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: new Map(),
    tasksChangeTracker: 1,
    rootTaskIDs: [],
    taskStorageUID: 0,

    showInnerTasks: true
};

const getters = {
    tasks(state, gettersArg) {
        return state.tasksChangeTracker && state.tasks;
    },
    taskByID: (state, gettersArg) => id => {
        return gettersArg.tasks.get(id);
    },
    hasTask: (state, gettersArg) => id => {
        return gettersArg.tasks.has(id);
    },
    tasksInTask: (state, gettersArg) => id => {
        if (!gettersArg.hasTask(id)) {
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
            let innerTasks = gettersArg.tagsInTasks(task.tasks);
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
    },

    showInnerTasks(state, gettersArg) {
        return state.showInnerTasks;
    },
};

const mutations = {
    incrementTaskChangeTracker(state) {
        state.tasksChangeTracker += 1;
    },

    setTask(state, task) {
        let taskID = task["id"];
        state.tasks.set(taskID, task);
        mutations.incrementTaskChangeTracker(state);
    },

    //this is how you make a recursive function inside an object
    removeTask: function recursiveRemove(state, taskID) {

        //removes any tasks that are inside the current one; they wouldn't be accessible after deletion anyway
        let task = state.tasks.get(taskID);
        task.tasks.map(innerTaskID => recursiveRemove(state, innerTaskID));

        state.tasks.delete(taskID);

        //we might need to delete the task ID from the root too
        let rootTaskIDIndex = state.rootTaskIDs.indexOf(taskID);
        if (rootTaskIDIndex > -1) {
            state.rootTaskIDs.splice(rootTaskIDIndex, 1);
        }
        mutations.incrementTaskChangeTracker(state);
    },

    addTaskToTask(state, {taskID, newTaskID}) {
        let task = state.tasks.get(taskID);
        task.tasks.push(newTaskID);
        mutations.incrementTaskChangeTracker(state);
    },
    addTaskToRoot(state, taskID) {
        state.rootTaskIDs.push(taskID);
    },

    initialiseTasks(state) {
        // load the tasks map
        let tasksKey = STORAGE_KEY + "-tasks";
        let mapStringFromLocalStorage = localStorage.getItem(tasksKey);
        if (mapStringFromLocalStorage) {
            state.tasks = new Map(JSON.parse(mapStringFromLocalStorage));
        }

        //load the root task IDs
        let rootTaskIDsKey = STORAGE_KEY + "-rootTaskIDs";
        let rootTaskIDsString = localStorage.getItem(rootTaskIDsKey);
        if (rootTaskIDsString) {
            state.rootTaskIDs = JSON.parse(rootTaskIDsString);
        }

        // load the task storage UID
        let UIDKey = STORAGE_KEY + "-taskStorageUID";
        let UIDString = localStorage.getItem(UIDKey);
        if (UIDString) {
            state.taskStorageUID = JSON.parse(UIDString);
        }
        mutations.incrementTaskChangeTracker(state);
    },
    incrementTaskStorageUID: (state) => {
        state.taskStorageUID++;
    },

    changeShowInnerTasks: (state, newShowInnerTasks) => {
        state.showInnerTasks = newShowInnerTasks;
    }
};

export default {
    state,
    getters,
    mutations
}