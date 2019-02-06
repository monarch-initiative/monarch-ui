/* eslint import/prefer-default-export: 0 */

import axios from 'axios';

// https://dataguide.nlm.nih.gov/eutilities/utilities.html#efetch

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
      retmode: 'text',
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
            result.pmLink = `https://www.ncbi.nlm.nih.gov/pubmed/${pubId}`;
            result.abstract = entrezAbstract.data;
            // console.log('result.abstract', result.abstract);
          }
        }
      ));
  }

  // bbop.monarch.Engine.prototype.fetchLiteratureInfo = function(id) {
  //     var self = this;
  //     var url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?';
  //     var opts = {
  //             'db' : 'pubmed',
  //             'retmode' : 'json',
  //             'id' : id
  //     };
  //     var info = {};
  //     var method = "GET";
  //     var obj = self.fetchUrl(url, opts, method);
  //     var summary = new eSummary.eSummaryResponse(obj);
  //
  //     info.authorList = summary.getAuthorList(id);
  //     info.publicationTitle = summary.getTitle(id);
  //
  //     info.journal = summary.getJournal(id);
  //     var date = summary.getDate(id);
  //
  //     if (date) {
  //         //parse year
  //         var year;
  //         var dateRegex = /.*(\d{4}).*/;
  //         var match = dateRegex.exec(date);
  //         if (match.length > 0) {
  //             year = match[1];
  //         }
  //         if (typeof year !== 'undefined') {
  //             info.year = year
  //         }
  //     }
  //
  //     return info;
  // }

  return result;
}
