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
        let currentSearchTerm = gettersArg.searchTerm && gettersArg.searchTerm.trim();

        let shouldShowInnerTasks = (gettersArg.visibility === "all" && currentSearchTerm.length === 0);
        if (shouldShowInnerTasks) {
            return gettersArg.rootTasks;
        }

        if (!currentSearchTerm) {
            return task.filters[gettersArg.visibility](gettersArg.tasksAsArray);
        }

        let tasksContainingSearchTerm = gettersArg.tasksAsArray.filter(task =>
            task.content.toLowerCase().indexOf(currentSearchTerm.toLowerCase()) > -1
        );
        return task.filters[gettersArg.visibility](tasksContainingSearchTerm);
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
}