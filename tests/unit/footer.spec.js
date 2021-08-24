import { expect } from "chai";
// import { shallowMount } from '@vue/test-utils';
import MonarchFooter from "@/components/Footer.vue";
import { shallowMountWithRouting } from "./test-utils";

// Fixing the:
//  Unknown custom element: <router-link>
// warning...
// See: https://stackoverflow.com/a/50639123/5667222
//

describe("Footer.vue", () => {
  it("renders About Monarch", () => {
    const wrapper = shallowMountWithRouting(MonarchFooter);

    expect(wrapper.text()).to.include("The Monarch Initiative");
  });
});
