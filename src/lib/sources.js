/**
 * Replaces a string SOURCE with an image tag with the source's logo.
 */

export default function sourceToImage(source) {
  let image = source;
  let label = "";

  if (source !== null && source !== '') {
    image = source.toLowerCase();
    // default label is uppercase
    label = source.split(/[/]+/)
      .pop()
      .split(/[.]+/)[0]
      .toUpperCase();
    if (image.match(/biogrid/i)) {
      image = 'source-biogrid.png';
      label = 'BioGRID';
    }
    else if (source.match(/clinvar/i)) {
      image = 'source-clinvar.png';
      label = 'ClinVar';
    }
    else if (source.match(/coriell/)) {
      image = 'source-coriell.png';
      label = 'Coriell';
    }
    else if (source.match(/ctd/i)) {
      image = 'source-ctd.png';
    }
    else if (source.match(/decipher/i)) {
      image = 'source-decipher.png';
      label = 'Decipher';
    }
    else if (source.match(/ensembl/)) {
      image = 'source-ensembl.png';
      label = 'Ensembl';
    }
    else if (source.match(/fb|flybase/i)) {
      image = 'source-flybase.png';
      label = 'FlyBase';
    }
    else if (source.match(/genereviews/i)) {
      image = 'source-genereviews.png';
      label = 'Gene Reviews';
    }
    else if (source.match(/hgnc/)) {
      image = 'source-hgnc.ico';
    }
    else if (source.match(/hpo/)) {
      image = 'source-hpo.png';
    }
    else if (source.match(/impc/)) {
      image = 'source-impc.png';
    }
    else if (source.match(/kegg/i)) {
      image = 'source-kegg.png';
    }
    else if (source.match(/mgi/)) {
      image = 'source-mgi.png';
    }
    else if (source.match(/mpd/)) {
      image = 'source-mpd.jpg';
    }
    else if (source.match(/mygene/i)) {
      image = 'source-mygene.png';
      label = 'MyGene';
    }
    else if (source.match(/omia/)) {
      image = 'source-omia.png';
    }
    else if (source.match(/o?mim/)) {
      image = 'source-omim.png';
    }
    else if (source.match(/orphanet/i)) {
      image = 'source-orphanet.png';
      label = 'Orphanet';
    }
    else if (source.match(/panther/i)) {
      image = 'source-panther.jpg';
      label = 'Panther';
    }
    else if (source.match(/pharmgkb/i)) {
      image = 'source-pharmgkb.png';
      label = 'PharmGKB';
    }
    else if (source.match(/pubmed|ncbi|pmid|entrez/i)) {
      image = 'source-ncbi.png';
    }
    else if (source.match(/uniprot/)) {
      image = 'source-uniprot.ico';
      label = 'UniProt';
    }
    else if (source.match(/vega/i)) {
      image = 'source-vega.png';
      label = 'Vega';
    }
    else if (source.match(/wb|wormbase/i)) {
      image = 'source-wormbase.png';
      label = 'Wormbase';
    }
    else if (source.match(/zfin/)) {
      image = 'source-zfin.png';
    }
    else if (source.match(/gwascatalog/)) {
      image = 'source-gwascatalog.png';
      label = 'GWAS Catalog';
    }
    else if (source.match(/animalqtldb/)) {
      image = 'source-animalqtldb.png';
      label = 'AnimalQTLdb';
    }
    else if (source.match(/go/)) {
      image = 'source-geneontology.png';
    }
    else if (source.match(/gene reviews/)) {
      image = 'source-genereviews.png';
      label = 'Gene Reviews';
    }
    else if (source.match(/mmrrc/)) {
      image = 'source-mmrrc.png';
    }
    else if (source.match(/reactome/)) {
      image = 'source-reactome.png';
      label = 'Reactome';
    }
    else if (source.match(/udp/)) {
      image = 'partner-udp.png';
    }
    else if (source.match(/string/)) {
      image = 'source-string.png';
    }
    else if (source.match(/bgee/)) {
      image = 'source-bgee.png';
      label = 'Bgee';
    }
    else if (source.match(/rgd/)) {
      image = 'source-rgd.gif';
    }
  }

  return [image, label];
}
