import { shallowMount } from '@vue/test-utils';

export function shallowMountWithRouting(component, options) {
  const newOptions = Object.assign({}, options);
  newOptions.stubs = ['router-link'];

  return shallowMount(component, newOptions);
}

// const index = {
//   shallowMount: shallowMountWithRouting,
// };

// module.exports = index;
