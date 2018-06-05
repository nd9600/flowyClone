const state = {
    searchTerm: ""
};

const getters = {
    searchTerm: (state) => {
        return state.searchTerm;
    }
};

const mutations = {
    changeSearchTerm: (state, newTerm) => {
        if (state.searchTerm !== newTerm) {
            state.searchTerm = newTerm;
        }
    }
};

export default {
    state,
    getters,
    mutations
}