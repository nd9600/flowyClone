import { mount } from '@vue/test-utils';
import Counter from '../src/components/Task.vue';

describe('Counter', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(Counter);

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
