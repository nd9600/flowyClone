<template>
    <div id="home">
        <header style="display: inline-block;">
            <h1>Home</h1>
            <input
                ref="newTaskInput"
                v-model="newTask"
                type="search"
                class="inputBox"
                placeholder="New task"
                @keyup.enter="addTaskFromInput"
            >

            <!-- there are two divs so that the visibility switches are on a new line -->
            <div>
                <div
                    class="searchBoxWrapper"
                    @mouseover="showClearButton = true"
                    @mouseleave="showClearButton = false"
                >
                    <input
                        ref="searchInput"
                        v-model="computedSearchTerm"
                        type="search"
                        class="inputBox"
                        placeholder="Search"
                    >
                    <a
                        v-if="showClearButton"
                        class="clearButton"
                        @click="computedSearchTerm = ''"
                    >x</a>
                </div>
            </div>

            <span>
                <a
                    :class="{ selected: localVisibility === 'all' }"
                    @click="localVisibility = 'all'"
                >all</a>
                <a
                    :class="{ selected: localVisibility === 'active' }"
                    @click="localVisibility = 'active'"
                >active</a>
                <a
                    :class="{ selected: localVisibility === 'completed' }"
                    @click="localVisibility = 'completed'"
                >completed</a>
            </span>

            <tags
                :tags="tags"
            >
            </tags>

            <div class="separator"></div>
        </header>
        <div id="topRight">
            <div id="topRightButtons">
                <button 
                    class="topRightButton" 
                    @click="setCurrentTopRightTab('settings')"
                >Settings
                </button>
                <button 
                    v-if="clipboard !== null"
                    class="topRightButton" 
                    @click="setCurrentTopRightTab('clipboard')"
                >Clipboard
                </button>
                <button 
                    v-if="storageMethod === 'firebase'"
                    class="topRightButton" 
                    @click="setCurrentTopRightTab('firebase')"
                >Firebase
                </button>
            </div>
            <div>
                <component :is="currentTopRightTab"></component>
            </div>
        </div>
        <section>
            <tasks
                :taskIDs="rootTaskIDs"
            >
            </tasks>

            <p 
                v-if="localVisibility !== 'completed'"
                style="color: #999;"
            >{{ numberOfTasksRemaining }} {{ numberOfTasksRemaining | pluralise }} left</p>
        </section>
        <div
            class="bottomRightButton"
            @click="addTask()"
        >+</div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Settings from "./Settings.vue";
import Clipboard from "./Clipboard.vue";
import Firebase from "./Firebase.vue";
import * as task from "../base/task.js";

export default {
    name: "Home",
    components: {
        Settings,
        Clipboard,
        Firebase
    },
    filters: {
        pluralise(n) {
            return n === 1 ? "item" : "items";
        }
    },
    data() {
        return {
            topRightComponent: "settings",
            newTask: "",
            showClearButton: false
        };
    },
    computed: {
        ...mapGetters([
            "tasksAsArray",
            "taskByID",
            "rootTasks",
            "rootTaskIDs",
            "tagsInTasks",
            "taskStorageUID",
            "searchTerm",
            "visibility",
            "clipboard",
            "currentTopRightTab",
            "storageMethod",
            "filteredTaskIDs"
        ]),

        localVisibility: {
            get() {
                return this.visibility;
            },
            set(newValue) {
                this.changeVisibility(newValue);
            }
        },

        numberOfTasksRemaining() {
            if (this.visibility === "active") {
                return this.filteredTaskIDs.length;
            }
            let vm = this;
            function recursiveNumberOfActiveTasks(taskID) {
                let thisTask = vm.taskByID(taskID);
                let thisTaskIsActive = thisTask.complete ? 0 : 1;

                let activeInnerTasks = thisTask.tasks.map(innerTaskID =>
                    recursiveNumberOfActiveTasks(innerTaskID)
                );
                let summedActiveInnerTasks = activeInnerTasks.reduce(
                    (acc, val) => acc + val,
                    0
                );

                return thisTaskIsActive + summedActiveInnerTasks;
            }

            let mappedNumberOfActiveTasks = this.filteredTaskIDs.map(taskID =>
                recursiveNumberOfActiveTasks(taskID)
            );
            return mappedNumberOfActiveTasks.reduce((acc, val) => acc + val, 0);
        },

        tags() {
            return this.tagsInTasks(this.filteredTaskIDs);
        },

        computedSearchTerm: {
            get() {
                return this.searchTerm;
            },
            set(value) {
                this.changeSearchTerm(value);
            }
        }
    },
    watch: {
        localVisibility() {
            let shouldShowInnerTasks =
                this.visibility === "all" && this.searchTerm.trim().length === 0;
            this.changeShowInnerTasks(shouldShowInnerTasks);
        },
        searchTerm() {
            let shouldShowInnerTasks =
                this.visibility === "all" && this.searchTerm.trim().length === 0;
            this.changeShowInnerTasks(shouldShowInnerTasks);
        }
    },
    mounted: function() {
        window.addEventListener("keyup", event => {
            let focusedElementIsntInput =
                document.activeElement.tagName.toLowerCase() !== "input" &&
                document.activeElement.tagName.toLowerCase() !== "textarea";

            switch (event.keyCode) {
            //focus on the new task field when n is pressed and you're not in an input
            case 78:
                if (focusedElementIsntInput) {
                    this.$refs.newTaskInput.focus();
                }
                break;

                //focus on the search field when s is pressed
            case 83:
                if (focusedElementIsntInput) {
                    this.$refs.searchInput.focus();
                }
                break;
            }
        });
    },
    methods: {
        ...mapMutations([
            "incrementTaskStorageUID",
            "changeSearchTerm",
            "changeVisibility",
            "setTask",
            "addTaskToRoot",
            "changeShowInnerTasks",
            "setCurrentTopRightTab"
        ]),

        addTaskFromInput() {
            let value = this.newTask && this.newTask.trim();
            if (!value) {
                return;
            }
            this.addTask(value);
        },
        addTask(value = "") {
            this.incrementTaskStorageUID();
            let newTask = new task.TaskObject({
                id: this.taskStorageUID,
                content: value,
                parent: "root"
            });
            this.setTask(newTask);
            this.addTaskToRoot(newTask.id);
            this.newTask = "";

            this.$nextTick(() => {
                let addedTaskInput = document.getElementById(
                    `task-${newTask.id}-input`
                );
                if (addedTaskInput) {
                    addedTaskInput.focus();
                }
            });
        }
    }
};
</script>

<style>
#home {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#topRight {
  position: absolute;
  top: 1%;
  right: 1%;
  min-width: 275px;
  max-width: 275px;
  padding: 0 0 10px 10px;
  border: 1px solid var(--separator-colour);

  opacity: 0.1;
}
#topRight:hover {
  opacity: 1;
}
#topRightButtons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.topRightButton {
  padding: 6px 10px;
  margin-bottom: -1px;
  margin-right: -1px;

  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  color: #34495e;
}

.bottomRightButton {
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 25%;
  right: 22%;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  padding: 10px;
  cursor: pointer;

  background-color: #f44336;
  background: #f44336;
  border: none;
  outline: none;
  color: #fff;
  opacity: 0.5;
  font-size: 36px;
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.bottomRightButton:hover {
  opacity: 1;
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.32), 0 3px 6px rgba(0, 0, 0, 0.46);
}
</style>
