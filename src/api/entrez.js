/* eslint import/prefer-default-export: 0 */

import axios from "axios";

// https://dataguide.nlm.nih.gov/eutilities/utilities.html#efetch
// Documentation for ESummary service:
// http://www.ncbi.nlm.nih.gov/books/NBK25499/#_chapter4_ESummary_

export async function getPublications(ids) {
  const regex = /^PMID:(\d+)$/;
  ids = ids.map((id) => (regex.exec(id) || [])[1]);

  if (!ids.length) return null;

  const entrezSummaryURL =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?";
  const entrezSummaryParams = {
    db: "pubmed",
    retmode: "json",
    id: ids.join(","),
  };

  const entrezAbstractURL =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?";
  const entrezAbstractParams = {
    db: "pubmed",
    retmode: "xml",
    rettype: "abstract",
    id: ids.join(","),
  };

  const results = [];

  await axios
    .all([
      axios.get(entrezSummaryURL, { params: entrezSummaryParams }),
      axios.get(entrezAbstractURL, { params: entrezAbstractParams }),
    ])
    .then(
      axios.spread(function spread(entrezSummary, entrezAbstract) {
        // console.log('entrezSummary', entrezSummary);
        // console.log('entrezAbstract', entrezAbstract);

        const abstracts = Array.from(
          new DOMParser()
            .parseFromString(entrezAbstract?.data || "", "text/xml")
            .getElementsByTagName("PubmedArticle")
        );

        /* eslint-disable no-restricted-syntax */
        for (const id of ids) {
          // if id is not a pubmed id or otherwise doesn't exist, add blank result
          if (!id) {
            results.push({});
            /* eslint-disable no-continue */
            continue;
          }

          // put summary in result
          const result = (entrezSummary?.data?.result || [])[id] || {};

          // find matching abstract xml entry
          const abstract = abstracts.find((article) =>
            article?.getElementsByTagName("PMID")[0]?.textContent?.includes(id)
          );

          // get doi from summary, or from abstract as backup, and put in result
          const summaryDoi = (result.articleids || []).find(
            ({ idtype }) => idtype === "doi"
          )?.value;
          const abstractDoi = (
            Array.from(abstract?.getElementsByTagName("ArticleId") || []).find(
              (articleId) => articleId?.getAttribute("IdType") === "doi"
            ) || {}
          ).textContent;
          result.doi = summaryDoi || abstractDoi || "";

          // get abstract text and put in result
          const abstractText = Array.from(
            abstract?.getElementsByTagName("AbstractText") || []
          )
            .map((textNode) => textNode?.textContent)
            .join("\n\n");
          result.abstract = abstractText;

          // put extra details in result
          result.pubmedURL = `https://www.ncbi.nlm.nih.gov/pubmed/${id}`;
          result.summaryURL = entrezSummary.request.responseURL;
          result.abstractURL = entrezAbstract.request.responseURL;

          results.push(result);
        }
      })
    );

  return results;
}
