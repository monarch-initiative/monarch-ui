import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import MonarchFooter from '@/components/Footer.md';

describe('Footer.md', () => {
  it('renders About Monarch', () => {
    const wrapper = shallowMount(MonarchFooter);
    console.log('wt', wrapper.text());
    expect(wrapper.text()).to.include('About Monarch');
  });
});
