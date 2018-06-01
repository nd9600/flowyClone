import {getTagsInString} from "../../base/task.js";

const STORAGE_KEY = 'tasks-flowyClone';

const state = {
    tasks: new Map(,
    tasksChangeTracker: 1,
    rootTaskIDs: [],
    taskStorageUID: 0
}

const getters = {
    tasks: (state, otherGetters) => {
        return state.tasksChangeTracker && state.tasks;
    },
    tasksAsArray: (state, otherGetters) => {
        return Object.values(otherGetters.tasks);
    },
    taskByID: (state, otherGetters) => id => {
        return otherGetters.tasks[id];
    },
    hasTask: (state, otherGetters) => id => {
        return typeof(otherGetters.tasks) !== "undefined";
    },
    tasksInTask: (state, otherGetters) => id => {
        console.log(otherGetters);
        if (! getters.hasTask(state)(id)) {
            return [];
        }
        let thisTask = getters.taskByID(state)(id);
        return thisTask.tasks.map(taskID => getters.taskByID(state, getters)(taskID));
    },

    rootTaskIDs(state, otherGetters) {
        return state.rootTaskIDs;
    },
    rootTasks(state, otherGetters) {
        console.log(otherGetters.tasks);
        console.log(otherGetters.taskByID(String(1)));
        return otherGetters.rootTaskIDs.map(id => otherGetters.taskByID(state, otherGetters)(String(id)));
    },

    tagsInTask: (state, otherGetters) => task => {
        let tagsInContent = getTagsInString(task.content);
        let tagsInDescription = getTagsInString(task.description);
        let tagsToReturn = tagsInContent.concat(tagsInDescription);
        if ((typeof task.tasks !== "undefined") && task.tasks.length > 0) {
            let innerTasks = getters.tagsInTasks(state)(task.tasks)
            tagsToReturn = tagsToReturn.concat(innerTasks);
        }
        return tagsToReturn.unique();
    },

    tagsInTasks: (state, otherGetters) => (tasks) => {
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

        let localTasksKey = STORAGE_KEY + "-tasks";
        //localStorage.setItem(localTasksKey, JSON.stringify(getters.tasks(state)));
    },
    setTasks(state, tasks) {
        state.tasks = JSON.parse(JSON.stringify(tasks));
        mutations.incrementTaskChangeTracker(state);
    },
    setTask(state, task) {
        let taskID = task["id"];
        console.log("setTask");
        console.trace();
        console.log(state.tasks);
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
        console.log("initialiseTasks");
        console.log("localStorage.getItem(STORAGE_KEY + '-tasks')");
        // if (localStorage.getItem(STORAGE_KEY + "-tasks")) {
        //     mutations.incrementTaskChangeTracker(state);
        //     state.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY + "-tasks"));
        // }

        // if (localStorage.getItem(STORAGE_KEY + "-taskStorageUID")) {
        //     state.taskStorageUID = JSON.parse(localStorage.getItem(STORAGE_KEY + "-taskStorageUID"));
        // }
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