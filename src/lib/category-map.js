/**
 * Convert a list of categories into a single-category, prioritizing
 * things like 'gene' over 'sequence feature'.
 * This function also maps SOLR category names like 'anatomical entity'
 * into BioLink category names like 'anatomy'.
 */

/* eslint import/prefer-default-export: 0 */

const validCats = {
  gene: "gene",
  variant: "variant",
  "sequence feature": "variant",
  genotype: "genotype",
  phenotype: "phenotype",
  disease: "disease",
  pathway: "pathway",
  "anatomical entity": "anatomy",
  publication: "publication",
  case: "case",
  // TODO remove this
  // when https://github.com/monarch-initiative/monarch-cypher-queries/commit/c3ff7c1
  // makes it to production
  "sequence featurevariant": "variant",
};

export function reduceCategoryList(categoryList) {
  const modelCats = ["cell line", "organism"];

  const categoryObj = categoryList.reduce((map, cat) => {
    const catKey = validCats[cat];
    if (catKey) {
      map[catKey] = catKey;
    }
    return map;
  }, {});

  const firstKey = Object.keys(categoryObj)[0];
  let result = false;

  // Gene variant category mixups
  if (firstKey) {
    result = categoryObj.gene || categoryObj.variant || categoryObj[firstKey];
  } else if (
    categoryList.filter((value) => modelCats.includes(value)).length > 0
  ) {
    // Get the intersection of categoryList and modelCats
    result = "model";
  } else {
    result = categoryList[0];
  }

  return result;
}

export function validCatToPath(cat) {
  return validCats[cat];
}
