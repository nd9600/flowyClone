import {getTagsInString} from "../../base/task.ts";
import STORAGE_KEY from "../key.js";
import firebaseDB from "../../firebaseConfig.js";

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

    initialiseTasksWithObject(state, storageObjectString) {
        if (! storageObjectString) {
            return;
        }
        let storageObject = JSON.parse(storageObjectString);

        if (storageObject.tasks) {
            state.tasks = new Map(storageObject.tasks);
        }

        if (storageObject.rootTaskIDs) {
            state.rootTaskIDs = storageObject.rootTaskIDs;
        }

        if (storageObject.taskStorageUID) {
            state.taskStorageUID = storageObject.taskStorageUID;
        }
    },

    setTask(state, task) {
        let taskID = task["id"];
        state.tasks.set(taskID, task);
        mutations.incrementTaskChangeTracker(state);
    },

    //this is how you make a recursive function inside an object
    deleteTask: function recursiveRemove(state, taskID) {

        //removes any tasks that are inside the current one; they wouldn't be accessible after deletion anyway
        let task = state.tasks.get(taskID);
        task.tasks.map(innerTaskID => recursiveRemove(state, innerTaskID));

        state.tasks.delete(taskID);

        //we might need to delete the task ID from the root too
        mutations.removeTaskFromRoot(state, taskID)
        mutations.incrementTaskChangeTracker(state);
    },

    removeTaskFromRoot(state, taskID) {
        let rootTaskIDIndex = state.rootTaskIDs.indexOf(taskID);
        if (rootTaskIDIndex > -1) {
            state.rootTaskIDs.splice(rootTaskIDIndex, 1);
        }
    },
    //only removes the taskID from the tasks array - doesn't delete the actual task
    removeTaskFromParentTask(state, {parentTaskID, innerTaskID}) {
        let parentTask = state.tasks.get(parentTaskID);
        let parentTaskIDIndex = parentTask.tasks.indexOf(innerTaskID);
        if (parentTaskIDIndex > -1) {
            parentTask.tasks.splice(parentTaskIDIndex, 1);
        }
        mutations.setTask(state, parentTask);
    },

    addTaskToTask(state, {taskID, newTaskID}) {
        let task = state.tasks.get(taskID);
        task.tasks.push(newTaskID);
        mutations.incrementTaskChangeTracker(state);
    },
    addTaskToRoot(state, taskID) {
        state.rootTaskIDs.push(taskID);
    },

    incrementTaskStorageUID: (state) => {
        state.taskStorageUID++;
    },

    changeShowInnerTasks: (state, newShowInnerTasks) => {
        state.showInnerTasks = newShowInnerTasks;
    }
};

const actions = {
    initialiseTasks(context) {
        if (context.getters.storageMethod === "localStorage") {
            let storageObjectString = localStorage.getItem(STORAGE_KEY);
            context.commit("initialiseTasksWithObject", storageObjectString);
            context.commit("incrementTaskChangeTracker");
        } else {
            let stateKey = context.getters.firebaseStateKey;
            firebaseDB.ref("states/" + stateKey).once("value").then(
                (snapshot) => {
                    context.commit("initialiseTasksWithObject", snapshot.val())
                    context.commit("incrementTaskChangeTracker");
            });
        }
    },
    saveStateToFirebase(context) {
        let stateKey = context.getters.firebaseStateKey;
        let storageObject = {
            tasks: Array.from(context.getters.tasks.entries()),
            rootTaskIDs: context.getters.rootTaskIDs,
            taskStorageUID: context.getters.taskStorageUID
        };
        //have to stringify it because firebase doesn't store empty arrays
        firebaseDB.ref("states/" + stateKey).set(JSON.stringify(storageObject));
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}