import {mount, shallowMount} from '@vue/test-utils';
import {localVue, TaskObject} from "../testMain.js";
import Vuex from "vuex";

import tasksModule from "../src/store/modules/tasks.js";
import settingsModule from "../src/store/modules/settings.js";
import clipboardModule from "../src/store/modules/clipboard.js";

import Task from '../src/components/Task.vue';

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

  it('renders the taskFlexbox', () => {
    const wrapper = shallowMount(Task, {
      store, 
      localVue,
      propsData: {
        taskID: testTask.id
      }
    });
    expect(wrapper.html()).toContain('<div class="taskFlexbox">');
  })

  // // it's also easy to check for the existence of elements
  // it('has a button', () => {
  //   const wrapper = shallowMount(Task, {
  //     store, 
  //     localVue,
  //     propsData: {
  //       taskID: testTask.id
  //     }
  //   });
  //   console.log(wrapper);
  //   expect(wrapper.contains('button')).toBe(true)
  // })

//   it('button should increment the count', () => {
//     expect(wrapper.vm.count).toBe(0)
//     const button = wrapper.find('button')
//     button.trigger('click')
//     expect(wrapper.vm.count).toBe(1)
//   })
})
