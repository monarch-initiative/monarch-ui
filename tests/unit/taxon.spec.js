import { expect } from 'chai';
import { labelToId, idToLabel } from '../../src/lib/TaxonMap';

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
