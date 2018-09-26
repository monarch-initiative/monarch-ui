import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import FooterAll from '@/components/FooterAll.vue';

describe('FooterAll.vue', () => {
  it('renders About Monarch', () => {
    const wrapper = shallowMount(FooterAll);
    console.log('wt', wrapper.text());
    expect(wrapper.text()).to.include('About Monarch');
  });
});
