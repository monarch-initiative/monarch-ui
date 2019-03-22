/**
 * Replaces a string SOURCE with an image tag with the source's logo.
 */

export default function sourceToImage(source) {
  let image = source;
  if (source !== null && source !== '') {
    image = source.toLowerCase();
    if (image.match(/biogrid/i)) {
      image = 'source-biogrid.ico';
    }
    else if (source.match(/clinvar/i)) {
      image = 'source-clinvar.png';
    }
    else if (source.match(/coriell/)) {
      image = 'source-coriell.png';
    }
    else if (source.match(/ctd/i)) {
      image = 'source-ctd.png';
    }
    else if (source.match(/decipher/i)) {
      image = 'source-decipher.png';
    }
    else if (source.match(/ensembl/)) {
      image = 'source-ensembl.png';
    }
    else if (source.match(/fb|flybase/i)) {
      image = 'source-flybase.png';
    }
    else if (source.match(/genereviews/i)) {
      image = 'source-genereviews.png';
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
    }
    else if (source.match(/omia/)) {
      image = 'source-omia.png';
    }
    else if (source.match(/o?mim/)) {
      image = 'source-omim.png';
    }
    else if (source.match(/orphanet/i)) {
      image = 'source-orphanet.png';
    }
    else if (source.match(/panther/i)) {
      image = 'source-panther.jpg';
    }
    else if (source.match(/pharmgkb/i)) {
      image = 'source-pharmgkb.png';
    }
    else if (source.match(/pubmed|ncbi|pmid|entrez/i)) {
      image = 'source-ncbi.png';
    }
    else if (source.match(/uniprot/)) {
      image = 'source-uniprot.ico';
    }
    else if (source.match(/vega/i)) {
      image = 'source-vega.png';
    }
    else if (source.match(/wb|wormbase/i)) {
      image = 'source-wormbase.png';
    }
    else if (source.match(/zfin/)) {
      image = 'source-zfin.png';
    }
    else if (source.match(/omia/)) {
      image = 'source-omia.png';
    }
    else if (source.match(/gwascatalog/)) {
      image = 'source-gwascatalog.png';
    }
    else if (source.match(/animalqtldb/)) {
      image = 'source-animalqtldb.png';
    }
    else if (source.match(/go/)) {
      image = 'partner-go.png';
    }
    else if (source.match(/gene reviews/)) {
      image = 'source-genereviews.png';
    }
    else if (source.match(/mmrrc/)) {
      image = 'source-mmrrc.png';
    }
    else if (source.match(/reactome/)) {
      image = 'source-reactome.png';
    }
    else if (source.match(/udp/)) {
      image = 'partner-udp.png';
    }
    else if (source.match(/string/)) {
      image = 'source-string.png';
    }
    else if (source.match(/bgee/)) {
      image = 'source-bgee.png';
    }
    else if (source.match(/rgd/)) {
      image = 'source-rgd.gif';
    }
  }

  return image;
}
