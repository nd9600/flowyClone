import {mount, shallowMount} from '@vue/test-utils';
import {localVue, TaskObject} from "../testMain-ignore.js";
import Vuex from "vuex";

import tasksModule from "../../src/store/modules/tasks.js";
import settingsModule from "../../src/store/modules/settings.js";
import clipboardModule from "../../src/store/modules/clipboard.js";

import Task from '../../src/components/Task.vue';
import GenericStub from "../GenericStub.vue";

describe('Task', () => {
  let store
  let testTask

  beforeEach(() => {    
    store = new Vuex.Store({
      modules: {
        tasksModule,
        settingsModule,
        clipboardModule
      }
    });

    store.commit("incrementTaskStorageUID");
    testTask = new TaskObject({
        id: store.getters.taskStorageUID,
        content: ""
    });
    store.commit("setTask", testTask);
  });

  it("renders the taskFlexbox", () => {
    const wrapper = shallowMount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    expect(wrapper.html()).toContain('<div class="taskFlexbox">');
  })

  it("1 inner task is added correctly", () => {
    const wrapper = shallowMount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      },
      stubs: {
        "tasks": GenericStub
      }
    });
    const vm = wrapper.vm;
    vm.addNewTask();
    
    let innerTasksDiv = wrapper.find(".innerTasks");
    let taskIDsAsAttribute = innerTasksDiv.attributes().taskids;
    let evaluatedTaskIDs = eval("[" + taskIDsAsAttribute + "]");

    expect(vm.task.tasks).toHaveLength(1);
    expect(evaluatedTaskIDs).toHaveLength(1);
  })

  it("2 inner tasks are added correctly", () => {
    const wrapper = mount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    const vm = wrapper.vm;
    vm.addNewTask();
    vm.addNewTask();

    let innerTasksDiv = wrapper.find(".innerTasks");
    let taskIDsAsAttribute = innerTasksDiv.attributes().taskids;
    let evaluatedTaskIDs = eval("[" + taskIDsAsAttribute + "]");

    expect(vm.task.tasks).toHaveLength(2);
    expect(evaluatedTaskIDs).toHaveLength(2);
  })

  it("6 inner tasks are added, and then 1 is removed, correctly", () => {
    const wrapper = mount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    const vm = wrapper.vm;
    vm.addNewTask();
    vm.addNewTask();
    vm.addNewTask();
    vm.addNewTask();
    vm.addNewTask();
    vm.addNewTask();

    let lastTaskID = vm.task.tasks[vm.task.tasks.length - 1];
    store.commit("removeTaskFromParentTask", {
      parentTaskID: testTask.id,
      innerTaskID: lastTaskID
    });
    store.commit("deleteTask", lastTaskID);

    let innerTasksDiv = wrapper.find(".innerTasks");
    let taskIDsAsAttribute = innerTasksDiv.attributes().taskids;
    let evaluatedTaskIDs = eval("[" + taskIDsAsAttribute + "]");

    expect(vm.task.tasks).toHaveLength(5);
    expect(evaluatedTaskIDs).toHaveLength(5);
  })

})
