import Vuex from "vuex";
import {store} from "../src/store/store.js";

import { createLocalVue, shallowMount } from '@vue/test-utils';
import Counter from '../src/components/Task.vue';

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Counter', () => {
  // Now mount the component and you have the wrapper
  const wrapper = shallowMount(Counter, {store});
  //const wrapper = mount(Counter);

  console.log(wrapper);

  it('renders the taskFlexbox', () => {
    expect(wrapper.html()).toContain('<div class="taskFlexbox">');
  })

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

//   it('button should increment the count', () => {
//     expect(wrapper.vm.count).toBe(0)
//     const button = wrapper.find('button')
//     button.trigger('click')
//     expect(wrapper.vm.count).toBe(1)
//   })
})
