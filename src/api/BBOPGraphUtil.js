// Functions to deal with BBOP graph json, retrieved from biolink-api
// https://berkeleybop.github.io/bbop-graph/doc/index.html

import us from 'underscore';

export function populateSourceTemplate(datum) {
  return {
    '_summary_iri': datum._summary_iri,
    '_version_iri': datum._version_iri,
    'sourceDisplayName': datum._version_iri,
    'sourceDescription': 'Unknown',
    'monarchUsage': 'Unknown',
    'vocabulary': 'Unknown',
    // to be extracted from BBOP tree:
    'ingestDate': 'Unknown',
    'rdfDownloadUrl': '', // URL for transform of source data, in RDF (in ttl, nt, or both)
    'sourceFiles': [], // [ {'fileUrl': url1, 'retrievedOn': '01-01-1970'}, {'fileUrl': url2, 'retrievedOn': '01-02-1970'}, ... ]
    'logoUrl': ''
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
  return _subjectPredicate2Object(versionIRI, 'dcat:Distribution', graph);
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
  us.each(staticSourceData, function fn(staticDatum){
    if(! dynamicSummaryIRIs.includes(staticDatum.summaryIRI)){
      var newSourceEntry = populateSourceTemplate({'_summary_iri': staticDatum.summaryIRI} );
      Object.assign(newSourceEntry, staticDatum)
      sourceData.push(newSourceEntry);
    }
  });
  return sourceData;
}

export function populateSourceFiles(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const sources = _subjectPredicate2Objects(sourceData[i]._version_iri, 'dcterms:source', graph);
    sourceData[i].sourceFiles = us.chain(sources)
      .map(function fn(source) {
        const node = graph.get_node(source);
        let retVal = 'Unknown';
        if (Object.prototype.hasOwnProperty.call(node._metadata, 'http://purl.org/pav/retrievedOn')) {
          retVal = node._metadata['http://purl.org/pav/retrievedOn'][0];
        }
        return { 'fileUrl': source, 'retrievedOn': retVal };
      })
      .value();
  }
}

export function populateIngestDate(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    sourceData[i].ingestDate =
            graph.get_node(sourceData[i]._version_iri)._metadata['http://purl.org/dc/terms/created'][0];
  }
}

export function populateRdfDownloadUrl(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const distributionIRI = _versionIRI2distributionIRI(sourceData[i]._version_iri, graph);
    const downloadUrl = _subjectPredicate2Object(distributionIRI, 'dcterms:downloadURL', graph);
    sourceData[i].rdfDownloadUrl = downloadUrl.replace('MonarchArchive:', 'https://archive.monarchinitiative.org/');
  }
}

export function populateLogoUrl(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const logoUrl = _subjectPredicate2Object(sourceData[i]._summary_iri, 'schemaorg:logo', graph);
    sourceData[i].logoUrl = logoUrl.replace(
      'MonarchLogoRepo:', '/img/sources/'
    );
  }
}
