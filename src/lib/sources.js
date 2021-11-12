/**
 * Replaces a string SOURCE with an image tag with the source's logo.
 */

export default function sourceToLabel(source) {
  let label = "";

  if (source !== null && source !== "") {
    // default label is all uppercase
    label = source.toUpperCase();

    if (source.match(/biogrid/i)) {
      label = "BioGRID";
    } else if (source.match(/clinvar/i)) {
      label = "ClinVar";
    } else if (source.match(/coriell/)) {
      label = "Coriell";
    } else if (source.match(/decipher/i)) {
      label = "Decipher";
    } else if (source.match(/ensembl/)) {
      label = "Ensembl";
    } else if (source.match(/fb|flybase/i)) {
      label = "FlyBase";
    } else if (source.match(/genereviews/i)) {
      label = "Gene Reviews";
    } else if (source.match(/hpo/)) {
      label = "HPO";
    } else if (source.match(/mygene/i)) {
      label = "MyGene";
    } else if (source.match(/orphanet/i)) {
      label = "Orphanet";
    } else if (source.match(/panther/i)) {
      label = "Panther";
    } else if (source.match(/pharmgkb/i)) {
      label = "PharmGKB";
    } else if (source.match(/uniprot/)) {
      label = "UniProt";
    } else if (source.match(/vega/i)) {
      label = "Vega";
    } else if (source.match(/wb|wormbase/i)) {
      label = "Wormbase";
    } else if (source.match(/gwascatalog/)) {
      label = "GWAS Catalog";
    } else if (source.match(/animalqtldb/)) {
      label = "AnimalQTLdb";
    } else if (source.match(/go/)) {
      label = "Gene Ontology";
    } else if (source.match(/gene reviews/)) {
      label = "Gene Reviews";
    } else if (source.match(/reactome/)) {
      label = "Reactome";
    } else if (source.match(/bgee/)) {
      label = "Bgee";
    }
  }

  return label;
}
