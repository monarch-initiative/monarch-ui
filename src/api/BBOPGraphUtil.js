// Functions to deal with BBOP graph json, retrieved from biolink-api
// https://berkeleybop.github.io/bbop-graph/doc/index.html
// These functions are called in BioLink.js getSources

import us from 'underscore';


const predicates = { // predicates used to retrieve items from BBOP graph json emitted by biolink
  'distribution': 'dcat:distribution',
  'source': 'dc:source',
  'retrievedOn': 'http://purl.org/pav/retrievedOn',
  'created': 'http://purl.org/dc/terms/created',
  'downloadUrl': 'dcat:downloadURL',
};


const curiePrefixURLs = { // various curie prefixes that need to be fixed/expanded to URLs
  'MonarchArchive': 'https://archive.monarchinitiative.org/',
  'CoriellCollection': 'https://catalog.coriell.org/1/',
  'OBO': 'http://purl.obolibrary.org/obo/',
  'ZFIN': 'http://zfin.org/',
};

export function populateSourceTemplate(datum) {
  return {
    '_summary_iri': datum._summary_iri,
    '_version_iri': datum._version_iri,
    'sourceDisplayName': datum._version_iri,
    'sourceDescription': '',
    'monarchUsage': '',
    'vocabulary': '',
    'logoUrl': '',
    // to be extracted from BBOP tree:
    'ingestDate': '',
    'rdfDownloadUrl': '', // URL for transform of source data, in RDF (in ttl, nt, or both)
    'sourceFiles': [], // [ {'fileUrl': url1, 'retrievedOn': '01-01-1970'}, {'fileUrl': url2, 'retrievedOn': '01-02-1970'}, ... ]
  };
}

export function _subjectPredicate2Objects(subjectIRI, predicate, graph) {
  const edges = graph.get_edges_by_subject(subjectIRI);
  const objectIRI = us.chain(edges)
    .filter(function fn(edge) {
      return edge._predicate_id === predicate;
    })
    .pluck('_object_id')
    .value();
  return objectIRI;
}

export function _subjectPredicate2Object(subjectIRI, predicate, graph) {
  return us.chain(_subjectPredicate2Objects(subjectIRI, predicate, graph))
    .first()
    .value();
}

export function _versionIRI2distributionIRI(versionIRI, graph) {
  return _subjectPredicate2Object(versionIRI, predicates.distribution, graph);
}

export function mergeStaticData(sourceData, staticSourceData) {
  // iterate through sourceData and attach data from staticSourceData
  const dynamicSummaryIRIs = [];
  sourceData = us.map(sourceData, function fn(sourceDatum) {
    dynamicSummaryIRIs.push(sourceDatum._summary_iri);
    if (Object.prototype.hasOwnProperty.call(sourceDatum, '_summary_iri')) {
      const staticDatum = staticSourceData[sourceDatum._summary_iri];
      return Object.assign({}, sourceDatum, staticDatum);
    }
    return sourceDatum;
  });

  // iterate through staticSourceData and populate sources that aren't in dynamic data from biolink-api (e.g. ClinVar)
  us.each(staticSourceData, function fn(staticDatum) {
    if (!dynamicSummaryIRIs.includes(staticDatum.summaryIRI)) {
      const newSourceEntry = populateSourceTemplate({ '_summary_iri': staticDatum.summaryIRI });
      Object.assign(newSourceEntry, staticDatum);
      sourceData.push(newSourceEntry);
    }
  });
  return sourceData;
}

export function populateSourceFiles(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const sources = _subjectPredicate2Objects(sourceData[i]._version_iri, predicates.source, graph);
    sourceData[i].sourceFiles = us.chain(sources)
      .map(function fn(source) {
        const node = graph.get_node(source);
        let retVal = '';
        if (Object.prototype.hasOwnProperty.call(node._metadata, predicates.retrievedOn)) {
          retVal = node._metadata[predicates.retrievedOn][0];
        }
        return { 'fileUrl': source, 'retrievedOn': retVal };
      })
      .map(function fixCuriePrefixes(source) {
        us.each(curiePrefixURLs, function fix(value, key) {
          source.fileUrl = source.fileUrl.replace(key + ':', value);
        });
        return source;
      })
      .value();
  }
}

export function populateIngestDate(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    sourceData[i].ingestDate = graph.get_node(sourceData[i]._version_iri)._metadata[predicates.created][0];
  }
}

export function populateRdfDownloadUrl(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const distributionIRI = _versionIRI2distributionIRI(sourceData[i]._version_iri, graph);
    const downloadUrl = _subjectPredicate2Object(distributionIRI, predicates.downloadUrl, graph);
    if (downloadUrl !== undefined) {
      sourceData[i].rdfDownloadUrl = downloadUrl.replace('MonarchArchive:', curiePrefixURLs.MonarchArchive);
    }
  }
}
