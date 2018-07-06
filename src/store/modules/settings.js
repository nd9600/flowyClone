import STORAGE_KEY from "../key.js";

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
    },

    initialiseSettingsWithObject: (state, storageObjectString) => {
        console.log("initialiseSettingsWithObject");
        if (! storageObjectString) {
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
}