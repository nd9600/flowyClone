import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from "vuex";

import tasksModule from "../src/store/modules/tasks.js";
import settingsModule from "../src/store/modules/settings.js";
import clipboardModule from "../src/store/modules/clipboard.js";

import Task from '../src/components/Task.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Task', () => {
  let store
  let getters
  let mutations

  beforeEach(() => {
    getters = {
      showInnerTasks: jest.fn(),
      showChildren: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        tasksModule,
        settingsModule,
        clipboardModule
      }
    });
  });

  it('renders the taskFlexbox', () => {
    const wrapper = shallowMount(Task, {store, localVue});
    console.log(wrapper);
    expect(wrapper.html()).toContain('<div class="taskFlexbox">');
  })

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    const wrapper = shallowMount(Task, {store, localVue});
    console.log(wrapper);
    expect(wrapper.contains('button')).toBe(true)
  })

//   it('button should increment the count', () => {
//     expect(wrapper.vm.count).toBe(0)
//     const button = wrapper.find('button')
//     button.trigger('click')
//     expect(wrapper.vm.count).toBe(1)
//   })
})
