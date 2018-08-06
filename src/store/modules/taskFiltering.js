import {filters as taskFilters} from "../../base/task.js";

const state = {
    searchTerm: "",
    visibility: "all"
};

const getters = {
    searchTerm: (state) => {
        return state.searchTerm;
    },
    visibility: (state) => {
        return state.visibility;
    },

    shownTaskIDs(state, gettersArg) {
        let filteredTaskIDs = gettersArg.filteredTaskIDs;
        let shownTaskIDs = filteredTaskIDs;
        //now recurse up to the root, adding all parent IDs

        function getParentTasks(taskID) {
            let thisTask = gettersArg.taskByID(taskID);
            if (thisTask.parent && thisTask.parent !== "root") {
                return [taskID].concat(...getParentTasks(thisTask.parent));
            }
            return [taskID];
        }

        return shownTaskIDs.map(getParentTasks).flatten().unique();
    },

    filteredTaskIDs(state, gettersArg) {
        const allTaskIDs = gettersArg.tasksAsArray.map(task => task.id);

        let currentSearchTerm = gettersArg.searchTerm && gettersArg.searchTerm.trim();
        let shouldShowAllTasks = (gettersArg.visibility === "all" && currentSearchTerm.length === 0);
        if (shouldShowAllTasks) {
            return allTaskIDs;
        }

        if (!currentSearchTerm) {
            return taskFilters[gettersArg.visibility](gettersArg.tasksAsArray)
                .map(task => task.id);
        }

        let tasksContainingSearchTerm = gettersArg.tasksAsArray.filter(task => {
            return task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1;
        });
        return taskFilters[gettersArg.visibility](tasksContainingSearchTerm)
            .map(task => task.id);
    }
};

const mutations = {
    changeSearchTerm: (state, newTerm) => {
        if (state.searchTerm !== newTerm) {
            state.searchTerm = newTerm;
        }
    },
    changeVisibility: (state, newVisibility) => {
        if (state.visibility !== newVisibility) {
            state.visibility = newVisibility;
        }
    },
};

export default {
    state,
    getters,
    mutations
};