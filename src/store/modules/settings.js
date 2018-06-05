const state = {
    showChildren: true
};

const getters = {
    showChildren(state, gettersArg) {
        return state.showChildren;
    }
};

const mutations = {
    setShowChildren: (state, newValue) => {
        state.showChildren = newValue;
    }
};

export default {
    state,
    getters,
    mutations
}