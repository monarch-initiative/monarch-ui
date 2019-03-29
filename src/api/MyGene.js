/* eslint import/prefer-default-export: 0 */

import axios from 'axios';

// http://docs.mygene.info/en/latest/doc/data.html#species
function getSpeciesFromTaxId(taxid) {
  switch (taxid) {
    case 9606:
      return 'Homo sapiens';
    case 10090:
      return 'Mus musculus';
    case 10116:
      return 'Rattus norvegicus';
    case 7227:
      return 'Drosophila melanogaster';
    case 6239:
      return 'Caenorhabditis elegans';
    case 7955:
      return 'Danio rerio';
    // unsupported
    // case 3702:
    //     return 'Arabidopsis thaliana';
    // case 8364:
    //     return 'Xenopus tropicalis';
    // case 9823:
    //     return 'Sus scrofa';
    default:
      return null;
  }
}

export async function getGeneDescription(geneId) {
  const mygeneURL = 'https://mygene.info/v3/query';

  // http://docs.mygene.info/en/latest/doc/data.html#species
  // http://docs.mygene.info/en/latest/doc/query_service.html#available-fields
  let formattedId = '';
  let speciesParam = 'all';

  if (geneId.match(/^NCBIGene/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, '$1');
  }
  else if (geneId.match(/^OMIM/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'mim:$1');
    speciesParam = 9606;
  }
  else if (geneId.match(/^MGI/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'mgi:MGI\\\\:$1');
    speciesParam = 10090;
  }
  else if (geneId.match(/^FlyBase/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'flybase:$1');
    speciesParam = 7227;
  }
  else if (geneId.match(/^Wormbase/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'wormbase:$1');
    speciesParam = 6239;
  }
  else if (geneId.match(/^ZFIN/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'zfin:$1');
    speciesParam = 7955;
  }
  else if (geneId.match(/^RGD/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'rgd:$1');
    speciesParam = 10116;
  }
  else {
    formattedId = geneId;
  }

  const mygeneParams = {
    q: formattedId,
    fields: 'summary,genomic_pos,name,symbol,taxid',
    species: speciesParam,
  };

  let result;

  try {
    const mygeneResponse = await axios.get(mygeneURL, { params: mygeneParams });

    // console.log('mygeneResponse', mygeneResponse);

    result = mygeneResponse.data;

    if (result.hits.length > 0) {
      const hit = result.hits[0];
      const symbol = hit.symbol;

      if (!hit.genomic_pos) {
        console.log('getGeneDescription MyGene response missing hit.genomic_pos', mygeneResponse);
      }
      else {
        const locationObj = hit.genomic_pos;
        if (!locationObj) {
          console.log('getGeneDescription MyGene response contains zero hit.genomic_pos, which is not currently supported by GenomeFeatureViewer', mygeneResponse);
        }
        else if (locationObj.length > 1) {
          //
          // This is a hack to detect genes (e.g., HGNC:11180) who return an array of genomic_pos,
          // rather than a single genomic_pos. The code below needs to be enhanced to deal with this
          // case, and perhaps GenomeFeatureViewer needs adjusting too.
          // I'm currently just detecting the situation, reporting it, and disabling the
          // GenomeFeatureViewer when this occurs.
          // Not all genes have this characteristic. For example, HGNC:11773 works fine.
          //
          console.log('getGeneDescription MyGene response contains more than one hit.genomic_pos, which is not currently supported by GenomeFeatureViewer', mygeneResponse);
          result = null;
        }
        else {
          let taxid = hit.taxid;

          // sometimes data is not on the genomic position
          if (!taxid) {
            taxid = locationObj.taxid;
          }
          // use this mapping: http://docs.mygene.info/en/latest/doc/data.html#species
          const thisSpecies = getSpeciesFromTaxId(taxid);
          if (!thisSpecies) {
            console.log('Species not found from mygene.info.  Not showing genome features.');
          }
          else {
            const defaultTrackName = 'All Genes'; // this is the generic track name
            const locationString = locationObj.chr + ':' + locationObj.start + '..' + locationObj.end;
            const apolloServerPrefix = 'https://agr-apollo.berkeleybop.io/apollo/';
            const externalUrl = 'http://jbrowse.alliancegenome.org/jbrowse/index.html?data=data/' + encodeURI(thisSpecies) + '&loc=' + encodeURI(locationString);
            const trackDataPrefix = apolloServerPrefix + 'track/' + encodeURI(thisSpecies) + '/' + defaultTrackName + '/' + encodeURI(locationString) + '.json';
            const trackDataWithHighlightURL = trackDataPrefix + '?name=' + symbol;

            // console.log('trackDataWithHighlight', trackDataWithHighlightURL);
            const trackResponse = await axios.get(trackDataWithHighlightURL);
            // console.log('trackResponse', trackResponse.data);

            result.trackResponse = trackResponse.data;
            result.externalURL = externalUrl;
          }
        }
      }
    }
  }
  catch (e) {
    console.log('MyGene.getGeneDescription error', e.message);
  }

  return result;
}
