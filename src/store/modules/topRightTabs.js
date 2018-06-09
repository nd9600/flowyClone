const state = {
    currentTopRightTab: "settings"
};

const getters = {
    currentTopRightTab(state, gettersArg) {
        return state.currentTopRightTab;
    }
};

const mutations = {
    setCurrentTopRightTab: (state, newValue) => {
        state.currentTopRightTab = newValue;
    }
};

export default {
    state,
    getters,
    mutations
}