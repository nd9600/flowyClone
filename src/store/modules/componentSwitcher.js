const state = {
    currentComponent: "",
    prop: []
}

const getters = {
    currentComponent: (state) => {
        return state.currentComponent;
    },
    prop: (state) => {
        return state.prop;
    }
}

const mutations = {
    changeCurrentComponent: function(state, {component, prop}) {
        if (state.currentComponent !== component) {
            state.currentComponent = component;
        }
        state.prop = prop;
    }
}

export default {
    state,
    getters,
    mutations
}