import Vue from "vue";
import Vuex from "vuex";

import STORAGE_KEY from "./key.js";
import tasksModule from "./modules/tasks.js";
import searchTermModule from "./modules/searchTerm.js";
import settingsModule from "./modules/settings.js";
import clipboardModule from "./modules/clipboard.js";
import topRightTabsModule from "./modules/topRightTabs.js";

import debounce from "lodash.debounce";
import * as process from "babel-core/lib/transformation/file/options/config";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        tasksModule,
        searchTermModule,
        settingsModule,
        clipboardModule,
        topRightTabsModule
    }
});

//this is only called at maximum twice a second
store.subscribe(
    debounce((mutation, state) => {
        if (state.settingsModule.storageMethod === "localStorage") {
            if (["setTask", "deleteTask", "addTaskToTask", "addTaskToRoot"].indexOf(mutation.type) > -1) {
                let storageObject = {
                    tasks: Array.from(state.tasksModule.tasks.entries()),
                    rootTaskIDs: state.tasksModule.rootTaskIDs,
                    taskStorageUID: state.tasksModule.taskStorageUID
                }            
                localStorage.setItem(STORAGE_KEY, JSON.stringify(storageObject));
            }
        }
    }, 300)
);