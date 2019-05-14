const taxonIdToLabelMap = {
  'NCBITaxon:28377': 'Anolis carolinensis',
  'NCBITaxon:3702': 'Arabidopsis thaliana',
  'NCBITaxon:9913': 'Bos taurus',
  'NCBITaxon:9788': 'Equidae',
  'NCBITaxon:6237': 'Caenorhabditis',
  'NCBITaxon:6239': 'Caenorhabditis elegans',
  'NCBITaxon:7955': 'Danio rerio',
  'NCBITaxon:7227': 'Drosophila melanogaster',
  'NCBITaxon:9796': 'Equus caballus',
  'NCBITaxon:9031': 'Gallus gallus',
  'NCBITaxon:9606': 'Homo sapiens',
  'NCBITaxon:9544': 'Macaca mulatta',
  'NCBITaxon:40674': 'Mammalia',
  'NCBITaxon:13616': 'Monodelphis domestica',
  'NCBITaxon:10090': 'Mus musculus',
  'NCBITaxon:10088': 'Mus <mouse, genus>',
  'NCBITaxon:39442': 'Mus musculus musculus',
  'NCBITaxon:10092': 'Mus musculus domesticus',
  'NCBITaxon:10091': 'Mus musculus castaneus',
  'NCBITaxon:57486': 'Mus musculus molossinus',
  'NCBITaxon:10102': 'Mus setulosus',
  'NCBITaxon:477815': 'Mus musculus musculus x M. m. domesticus',
  'NCBITaxon:10096': 'Mus spretus',
  'NCBITaxon:35531': 'Mus musculus bactrianus',
  'NCBITaxon:9258': 'Ornithorhynchus anatinus',
  'NCBITaxon:9598': 'Pan troglodytes',
  'NCBITaxon:10116': 'Rattus norvegicus',
  'NCBITaxon:4932': 'Saccharomyces cerevisiae',
  'NCBITaxon:559292': 'Saccharomyces cerevisiae S288C',
  'NCBITaxon:9823': 'Sus scrofa',
  'NCBITaxon:8364': 'Xenopus (Silurana) tropicalis',
  'NCBITaxon:9845': 'Ruminantia',
  'NCBITaxon:9615': 'Canis lupus familiaris',
  'NCBITaxon:9681': 'Felidae',
  'NCBITaxon:9685': 'Felis catus',
  'NCBITaxon:33554': 'Carnivora',
  'NCBITaxon:9822': 'Sus',
  'NCBITaxon:9821': 'Suidae',
  'NCBITaxon:9895': 'Bovidae',
  'NCBITaxon:33090': 'Viridiplantae',
  'NCBITaxon:9783': 'Elephas maximus',
  'NCBITaxon:9940': 'Ovis aries',

  'NCBITaxon:9545': 'Macaca nemestrina',
  'NCBITaxon:10029': 'Cricetulus griseus',
  'NCBITaxon:54600': 'Macaca nigra',
  'NCBITaxon:9538': 'Erythrocebus patas',
  'NCBITaxon:9986': 'Oryctolagus cuniculus',
  'NCBITaxon:78454': 'Saguinus labiatus',
  'NCBITaxon:9487': 'Saguinus fuscicollis',
  'NCBITaxon:9519': 'Lagothrix lagotricha',
  'NCBITaxon:9521': 'Saimiri sciureus',
  'NCBITaxon:9523': 'Plecturocebus moloch',
  'NCBITaxon:9888': 'Muntiacus muntjak',

  // 'NCBITaxon:57486': '',
  // 'NCBITaxon:10091': '',
  // 'NCBITaxon:477815': '',
  // 'NCBITaxon:10102': '',
  // 'NCBITaxon:10088': '',
  // 'NCBITaxon:10096': '',
  // 'NCBITaxon:35531': '',
  // 'NCBITaxon:9615': '',
  // 'NCBITaxon:9685': '',
  // 'NCBITaxon:9940': '',

  'OBI:0100026': 'Organism',
};

export function idToLabel(id) {
  return taxonIdToLabelMap[id];
}

export function labelToId(label) {
  const entry = Object.entries(taxonIdToLabelMap).find((e) => {
    return e[1] === label;
  });
  if (entry) {
    return entry[0];
  }
  return null;
}

const cardTypesSupportingTaxon = [
  'gene',
  'genotype',
  'model',
  'variant',
  'homolog'
];

export function isTaxonCardType(cardType) {
  return cardTypesSupportingTaxon.indexOf(cardType) >= 0;
}
