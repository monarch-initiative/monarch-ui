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
    expect('NCBITaxon:78454', labelToId('Saguinus fuscicollis'));
    expect('NCBITaxon:10116', labelToId('Rattus norvegicus'));
    expect(idToLabel('NCBITaxon:78454'), 'Saguinus fuscicollis');
    expect(idToLabel('NCBITaxon:10116'), 'Rattus norvegicus');
  });
});
