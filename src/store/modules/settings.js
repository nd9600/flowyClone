const state = {
    showChildren: true,
    storageMethod: "localStorage",
    firebaseStateKey: "test"
};

const getters = {
    showChildren(state, gettersArg) {
        return state.showChildren;
    },
    storageMethod(state, gettersArg) {
        return state.storageMethod;
    },
    firebaseStateKey(state, gettersArg) {
        return state.firebaseStateKey;
    }
};

const mutations = {
    setShowChildren: (state, newValue) => {
        state.showChildren = newValue;
    },
    setStorageMethod: (state, newValue) => {
        state.storageMethod = newValue;
    },
    setFirebaseStateKey: (state, newValue) => {
        state.firebaseStateKey = newValue;
    }
};

export default {
    state,
    getters,
    mutations
}