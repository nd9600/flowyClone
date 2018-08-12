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

    /**
     * Returns the filteredTaskIDs, plus any of their parents up to the root, so that they are shown in their correct position
     * @param {*} state 
     * @param {*} gettersArg 
     */
    shownTaskIDs(state, gettersArg) {
        let filteredTaskIDs = gettersArg.filteredTaskIDs;

        //now recurse up to the root, adding all parent IDs
        function getParentTasks(taskID) {
            const thisTask = gettersArg.taskByID(taskID);
            if (thisTask.parent && thisTask.parent !== "root") {
                return [taskID].concat(...getParentTasks(thisTask.parent));
            }
            return [taskID];
        }

        //filteredTaskIDsAndParents
        return filteredTaskIDs.map(getParentTasks).flatten().unique();
    },

    /**
     * 
     * @param {*} state 
     * @param {*} gettersArg 
     * @returns number[]
     */
    filteredTaskIDs(state, gettersArg) {

        // if searching for all visibility types, and no search term, just return all tasks
        const currentSearchTerm = gettersArg.searchTerm && gettersArg.searchTerm.trim();
        const shouldShowAllTasks = (gettersArg.visibility === "all" && currentSearchTerm.length === 0);
        if (shouldShowAllTasks) {
            return gettersArg.tasksAsArray.map(task => task.id);
        }

        // else if there's no search term, search by visibility
        if (!currentSearchTerm) {
            return taskFilters[gettersArg.visibility](gettersArg.tasksAsArray)
                .map(task => task.id);
        }

        // else search by search term and visibility
        const tasksContainingSearchTerm = gettersArg.tasksAsArray.filter(task => {
            return task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1;
        });

        const tasksFilteredByVisibility = taskFilters[gettersArg.visibility](tasksContainingSearchTerm);
        const finalTaskIDs = tasksFilteredByVisibility.map(task => task.id);

        // if searching for a tag, include all the found task's children
        if (currentSearchTerm[0] === "#") {
            const getChildTasks = (taskID) => {
                const thisTask = gettersArg.taskByID(taskID);
                return [taskID].concat(
                    ...thisTask.tasks.map(getChildTasks)
                );
            };

            return finalTaskIDs.map(getChildTasks).flatten().unique();
        }
        return finalTaskIDs;
            
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