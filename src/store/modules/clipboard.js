const state = {
    clipboard: null,
    clipboardMode: "copy"
};

const getters = {
    clipboard(state, gettersArg) {
        return state.clipboard;
    },
    clipboardMode(state, gettersArg) {
        return state.clipboardMode;
    }
};

const mutations = {
    setClipboard: (state, newValue) => {
        state.clipboard = newValue;
    },
    setClipboardMode: (state, newValue) => {
        state.clipboardMode = newValue;
    }
};

export default {
    state,
    getters,
    mutations
};