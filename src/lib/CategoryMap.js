/**
 * Convert a list of categories into a single-category, prioritizing
 * things like 'gene' over 'sequence feature'.
 * This function also maps SOLR category names like 'anatomical entity'
 * into BioLink category names like 'anatomy'.
 */

/* eslint import/prefer-default-export: 0 */

export function reduceCategoryList(categoryList) {
  const validCats = {
    'gene': 'gene',
    'variant': 'variant',
    'phenotype': 'phenotype',
    'genotype': 'genotype',
    'disease': 'disease',
    'pathway': 'pathway',
    'anatomical entity': 'anatomy',
    'publication': 'publication',
  };
  const categoryObj = categoryList.reduce((map, cat) => {
    const catKey = validCats[cat];
    if (catKey) {
      map[catKey] = catKey;
    }
    return map;
  }, {});

  const firstKey = Object.keys(categoryObj)[0];
  let result;
  if (firstKey) {
    result = categoryObj.gene
      || categoryObj.variant
      || categoryObj[firstKey];
  }
  else {
    result = categoryList[0];
  }

  return result;
}
