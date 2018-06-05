const state = {
    clipboard: []
};

const getters = {
    clipboard(state, gettersArg) {
        return state.clipboard;
    }
};

const mutations = {
    setClipboard: (state, newValue) => {
        state.clipboard = newValue;
    }
};

export default {
    state,
    getters,
    mutations
}