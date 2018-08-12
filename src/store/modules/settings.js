import STORAGE_KEY from "../key.js";

const state = {
    storageMethod: "localStorage",
    firebaseStateKey: "test"
};

const getters = {
    storageMethod(state, gettersArg) {
        return state.storageMethod;
    },
    firebaseStateKey(state, gettersArg) {
        return state.firebaseStateKey;
    }
};

const mutations = {
    setStorageMethod: (state, newValue) => {
        state.storageMethod = newValue;
    },
    setFirebaseStateKey: (state, newValue) => {
        state.firebaseStateKey = newValue;
    },

    initialiseSettingsWithObject: (state, storageObjectString) => {
        if (!storageObjectString) {
            return;
        }
        let storageObject = JSON.parse(storageObjectString);

        if (storageObject.settings) {
            state.storageMethod = storageObject.settings.storageMethod;
            state.firebaseStateKey = storageObject.settings.firebaseStateKey;
        }
    },
};

const actions = {
    initialiseSettings(context) {
        let storageObjectString = localStorage.getItem(STORAGE_KEY);
        context.commit("initialiseSettingsWithObject", storageObjectString);
    },
};

export default {
    state,
    getters,
    mutations,
    actions
};