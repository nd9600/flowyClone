import Vue from "vue";
import Vuex from "vuex";

import STORAGE_KEY from "./key.js";
import storageModule from "./modules/storage.js";
import tasksModule from "./modules/tasks.js";
import taskFilteringModule from "./modules/taskFiltering.js";
import settingsModule from "./modules/settings.js";
import clipboardModule from "./modules/clipboard.js";
import topRightTabsModule from "./modules/topRightTabs.js";

import debounce from "lodash.debounce";
import * as process from "babel-core/lib/transformation/file/options/config";

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {
        storageModule,
        tasksModule,
        taskFilteringModule,
        settingsModule,
        clipboardModule,
        topRightTabsModule
    }
});

//this is only called at maximum three times a second
store.subscribe(
    debounce((mutation, state) => {
        let storageObjectBuilder = () =>  ({
            tasks: Array.from(state.tasksModule.tasks.entries()),
            rootTaskIDs: state.tasksModule.rootTaskIDs,
            taskStorageUID: state.tasksModule.taskStorageUID,
            settings: {
                storageMethod: state.settingsModule.storageMethod,
                firebaseStateKey: state.settingsModule.firebaseStateKey
            }
        });        

        const storageMethodIsLocalStorage = state.settingsModule.storageMethod === "localStorage";
        const mutationIsTasksChange = ["setTask", "deleteTask", "addTaskToTask", "addTaskToRoot"]
            .indexOf(mutation.type) > -1;
        const mutationIsStorageChange = ["setStorageMethod", "setFirebaseStateKey"]
            .indexOf(mutation.type) > -1;
        if ((storageMethodIsLocalStorage && mutationIsTasksChange) || mutationIsStorageChange) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storageObjectBuilder()));
        }
    }, 300)
);

export default store;
