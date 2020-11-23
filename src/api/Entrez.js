/* eslint import/prefer-default-export: 0 */

import axios from 'axios';

// https://dataguide.nlm.nih.gov/eutilities/utilities.html#efetch
// Documentation for ESummary service:
// http://www.ncbi.nlm.nih.gov/books/NBK25499/#_chapter4_ESummary_

export async function getPublication(nodeId) {
  let pubId = null;
  const regex = /^PMID:(\d+)$/;
  const regres = regex.exec(nodeId);
  if (regres !== null) {
    pubId = regres[1];
  }

  let result = null;

  if (pubId) {
    const entrezSummaryURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?';
    const entrezSummaryParams = {
      db: 'pubmed',
      retmode: 'json',
      id: pubId
    };

    const entrezAbstractURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?';
    const entrezAbstractParams = {
      db: 'pubmed',
      retmode: 'xml',
      rettype: 'abstract',
      id: pubId
    };

    await axios.all([
      axios.get(entrezSummaryURL, { params: entrezSummaryParams }),
      axios.get(entrezAbstractURL, { params: entrezAbstractParams }),
    ])
      .then(axios.spread(
        function spread(entrezSummary, entrezAbstract) {
          // console.log('entrezSummary', entrezSummary);
          // console.log('entrezAbstract', entrezAbstract);

          if (entrezSummary && entrezSummary.data && entrezSummary.data.result) {
            result = entrezSummary.data.result[pubId];
            result.abstract = entrezAbstract.data;
            result.pubmedURL = `https://www.ncbi.nlm.nih.gov/pubmed/${pubId}`;
            result.summaryURL = entrezSummary.request.responseURL;
            result.abstractURL = entrezAbstract.request.responseURL;
          }
        }
      ));
  }

  return result;
}
