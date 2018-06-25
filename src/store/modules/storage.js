const state = {
};

const getters = {
};

const mutations = {
};

const actions = {
    initialiseApp(context) {
        context.dispatch("initialiseSettings", null, { root: true });
        context.dispatch("initialiseTasks", null, { root: true });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}