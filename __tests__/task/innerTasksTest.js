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

  it("has no inner tasks by default", () => {
    const wrapper = shallowMount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    expect(wrapper.vm.task.tasks).toHaveLength(0);
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
    wrapper.vm.addNewTask();
    expect(wrapper.vm.task.tasks).toHaveLength(1);
  })

  it("2 inner tasks are added correctly", () => {
    const wrapper = mount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    wrapper.vm.addNewTask();
    wrapper.vm.addNewTask();

    expect(wrapper.vm.task.tasks).toHaveLength(2);

    let showHideChildrenButton = wrapper.find(".showHide");
    let innerTasksDiv = wrapper.find(".innerTasks");

    //there should be 2 taskIDs after adding 2 tasks, but they only show up when you collapse and expand the children
    console.log(wrapper.html());
    console.log(wrapper.vm.task.tasks);
    console.log(innerTasksDiv.attributes().taskids);
    expect(wrapper.vm.task.tasks).toHaveLength(2);
    expect(innerTasksDiv.attributes().taskids).toHaveLength(2);

    showHideChildrenButton.trigger("click");
    //wrapper.vm.$data.expandChildrenFlag = false;
    //wrapper.vm.$data.expandChildrenFlag = true;
    showHideChildrenButton.trigger("click");

    expect(wrapper.vm.task.tasks).toHaveLength(2);
    expect(innerTasksDiv.attributes().taskids).toHaveLength(2);
  })

})
