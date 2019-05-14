import { expect } from 'chai';
// import { shallowMount } from '@vue/test-utils';
import { shallowMountWithRouting } from './test-utils';
// import MonarchFooter from '@/components/Footer.md';
import { labelToId, idToLabel} from '../../src/lib/TaxonMap';

// Fixing the:
//  Unknown custom element: <router-link>
// warning...
// See: https://stackoverflow.com/a/50639123/5667222
//

describe('taxon lookups', () => {
  it('test taxon lookups', () => {
    expect(idToLabel('NCBITaxon:78454')).to.equal('Saguinus labiatus');
    expect(idToLabel('NCBITaxon:10116')).to.equal('Rattus norvegicus');
    expect(idToLabel('NCBITaxon:10BAD')).to.equal(undefined);
    expect('NCBITaxon:78454').to.equal(labelToId('Saguinus labiatus'));
    expect('NCBITaxon:10116').to.equal(labelToId('Rattus norvegicus'));
    expect(null).to.equal(labelToId('Rattus bad'));
  });
});
